import Docker from 'dockerode';
import type { Duplex } from 'node:stream';
import type { LabProfileSpec } from './profiles.js';

// ─── Docker provisioning with egress isolation ───────────────────────────
// Falls back to "simulated" mode when no Docker socket is reachable so the
// broker (and the whole platform) never hard-fails in dev/CI.

export interface ProvisionedNode {
  hostname: string;
  role: string;
  ip: string;
  containerId?: string;
}

export interface ProvisionResult {
  nodes: ProvisionedNode[];
  networkId?: string;
  simulated: boolean;
}

let docker: Docker | null = null;
export let dockerAvailable = false;

export async function initDocker(log: (m: string) => void): Promise<void> {
  try {
    docker = new Docker();
    await docker.ping();
    dockerAvailable = true;
    log('[docker] socket reachable — real lab provisioning enabled.');
  } catch (e) {
    docker = null;
    dockerAvailable = false;
    log(`[docker] unavailable (${(e as Error).message}) — simulated lab mode.`);
  }
}

const LABELS = (sessionId: string) => ({
  'nethex.session': sessionId,
  'nethex.ephemeral': 'true',
});

export async function provision(
  sessionId: string,
  profile: LabProfileSpec,
  log: (m: string) => void,
): Promise<ProvisionResult> {
  if (!docker || !dockerAvailable) {
    return {
      simulated: true,
      nodes: profile.nodes.map((n, i) => ({
        hostname: n.hostname,
        role: n.role,
        ip: `10.10.${20 + i}.${10 + i}`,
      })),
    };
  }

  let networkId: string | undefined;
  // Multi-node labs get a private, internet-less bridge (internal: true).
  if (profile.egress === 'internal') {
    const net = await docker.createNetwork({
      Name: `nethex-${sessionId}`,
      Driver: 'bridge',
      Internal: true, // ← drops egress: no route off the bridge
      Labels: LABELS(sessionId),
    });
    networkId = net.id;
  }

  const nodes: ProvisionedNode[] = [];
  for (const spec of profile.nodes) {
    const container = await docker.createContainer({
      Image: spec.image,
      name: `nethex-${sessionId}-${spec.hostname}`,
      Hostname: spec.hostname,
      Tty: true,
      OpenStdin: true,
      Labels: LABELS(sessionId),
      HostConfig: {
        // Single-host labs: NetworkMode "none" = no NIC at all = zero egress.
        NetworkMode: profile.egress === 'none' ? 'none' : `nethex-${sessionId}`,
        AutoRemove: true,
        Memory: 512 * 1024 * 1024,
        NanoCpus: 1_000_000_000, // 1 vCPU
        PidsLimit: 256,
        CapDrop: ['ALL'],
        SecurityOpt: ['no-new-privileges'],
        ReadonlyRootfs: false,
      },
    });
    await container.start();
    const info = await container.inspect();
    nodes.push({
      hostname: spec.hostname,
      role: spec.role,
      ip:
        info.NetworkSettings?.Networks?.[`nethex-${sessionId}`]?.IPAddress ||
        info.NetworkSettings?.IPAddress ||
        'isolated',
      containerId: container.id,
    });
  }
  log(`[docker] provisioned ${nodes.length} node(s) for ${sessionId} (egress=${profile.egress}).`);
  return { nodes, networkId, simulated: false };
}

export async function teardown(sessionId: string, log: (m: string) => void): Promise<void> {
  if (!docker || !dockerAvailable) return;
  const containers = await docker.listContainers({
    all: true,
    filters: { label: [`nethex.session=${sessionId}`] },
  });
  await Promise.all(
    containers.map((c) =>
      docker!.getContainer(c.Id).remove({ force: true }).catch(() => {}),
    ),
  );
  const nets = await docker.listNetworks({ filters: { label: [`nethex.session=${sessionId}`] } });
  await Promise.all(nets.map((n) => docker!.getNetwork(n.Id).remove().catch(() => {})));
  log(`[docker] torn down session ${sessionId}.`);
}

/** Attach an interactive PTY (docker exec) to a session's primary node. */
export async function attachPty(
  containerId: string,
  cols: number,
  rows: number,
): Promise<Duplex> {
  if (!docker) throw new Error('docker unavailable');
  const container = docker.getContainer(containerId);
  const exec = await container.exec({
    Cmd: ['/bin/sh', '-c', 'exec /bin/bash 2>/dev/null || exec /bin/sh'],
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: true,
  });
  const stream = await exec.start({ hijack: true, stdin: true, Tty: true });
  try {
    await exec.resize({ w: cols, h: rows });
  } catch {
    /* resize best-effort */
  }
  return stream as unknown as Duplex;
}
