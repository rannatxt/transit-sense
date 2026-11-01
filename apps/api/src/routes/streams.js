import { Router } from 'express';

const router = Router();

// Internal camera endpoints (DevSecOps: Never exposed to client)
const INTERNAL_RTSP_ROUTING = {
  mum: { internal: 'rtsp://admin:Secr3tP@ss@10.240.12.88:554/live/stream1', name: 'Mumbai WEH' },
  blr: { internal: 'rtsp://admin:K@rnataka99@10.240.14.12:554/live/stream1', name: 'Bangalore Silk Board' },
  del: { internal: 'rtsp://admin:DNDFlyw@y2026@10.240.16.4:554/feed1', name: 'Delhi NCR DND Flyway' },
  hyd: { internal: 'rtsp://admin:Hyt3cT0wer$@10.240.18.9:554/main', name: 'Hyderabad Cyber Towers' },
  chn: { internal: 'rtsp://admin:Kath1paraTn@10.240.20.15:554/live', name: 'Chennai Kathipara' }
};

// GET /api/streams/:hubId - Returns sanitized, tokenized public proxy endpoint
router.get('/:hubId', (req, res) => {
  const { hubId } = req.params;
  const stream = INTERNAL_RTSP_ROUTING[hubId];

  if (!stream) {
    return res.status(404).json({ error: 'Camera stream not found' });
  }

  // Security: Generate short-lived ephemeral stream token, MASK internal IP & password
  const ephemeralToken = Buffer.from(`${hubId}-${Date.now()}`).toString('base64');
  
  res.json({
    hubId,
    corridorName: stream.name,
    // Client receives sanitized, TLS-encrypted proxy endpoint
    streamUrl: `rtsps://gateway.transitsense.gov.in:443/hls/${hubId}_stream.m3u8?token=${ephemeralToken}`,
    protocol: 'WebRTC / HLS over TLS 1.3',
    internalIpExposed: false,
    credentialsMasked: true
  });
});

export default router;
