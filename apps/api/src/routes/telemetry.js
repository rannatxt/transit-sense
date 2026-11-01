import { Router } from 'express';

const router = Router();

const HUB_TELEMETRY = {
  mum: {
    hubId: 'mum',
    name: 'Mumbai',
    junction: 'Western Express Highway (WEH) Andheri',
    status: 'HEAVY',
    speedLimit: '70 km/h',
    counts: { auto: 412, bike: 788, car: 702, heavy: 218, pedestrian: 64 },
    lci: [78, 54, 84, 62],
    throughput: 154,
    latencyMs: 11.4,
    fps: 59.8
  },
  blr: {
    hubId: 'blr',
    name: 'Bangalore',
    junction: 'Silk Board Junction',
    status: 'CRITICAL',
    speedLimit: '50 km/h',
    counts: { auto: 460, bike: 890, car: 620, heavy: 250, pedestrian: 85 },
    lci: [88, 72, 92, 70],
    throughput: 138,
    latencyMs: 11.2,
    fps: 60.0
  },
  del: {
    hubId: 'del',
    name: 'Delhi NCR',
    junction: 'DND Flyway Toll Plaza',
    status: 'OPTIMAL',
    speedLimit: '70 km/h',
    counts: { auto: 180, bike: 540, car: 1120, heavy: 380, pedestrian: 28 },
    lci: [42, 36, 48, 32],
    throughput: 168,
    latencyMs: 10.9,
    fps: 59.9
  },
  hyd: {
    hubId: 'hyd',
    name: 'Hyderabad',
    junction: 'HITEC City Cyber Towers',
    status: 'MODERATE',
    speedLimit: '50 km/h',
    counts: { auto: 320, bike: 690, car: 740, heavy: 160, pedestrian: 58 },
    lci: [56, 48, 62, 50],
    throughput: 142,
    latencyMs: 11.5,
    fps: 59.8
  },
  chn: {
    hubId: 'chn',
    name: 'Chennai',
    junction: 'Kathipara Flyover',
    status: 'HEAVY',
    speedLimit: '60 km/h',
    counts: { auto: 380, bike: 760, car: 590, heavy: 270, pedestrian: 72 },
    lci: [76, 60, 82, 58],
    throughput: 149,
    latencyMs: 11.3,
    fps: 59.8
  }
};

// GET /api/telemetry/:hubId
router.get('/:hubId', (req, res) => {
  const data = HUB_TELEMETRY[req.params.hubId] || HUB_TELEMETRY.mum;
  res.json({
    timestamp: new Date().toISOString(),
    ...data
  });
});

export default router;
