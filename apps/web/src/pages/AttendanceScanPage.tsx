import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar, Badge, Button, Card, PageHeader } from '@eduportal/ui';
import { Camera, Check, AlertCircle, X } from 'lucide-react';
import type { QRScanResponse } from '@eduportal/shared';
import { Html5Qrcode } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { attendanceService } from '../services/api/attendance.service';

export default function AttendanceScanPage() {
  const [running, setRunning] = useState(false);
  const [last, setLast] = useState<QRScanResponse | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScannedRef = useRef<string>('');

  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => undefined);
    };
  }, []);

  async function start() {
    const container = document.getElementById('qr-reader');
    if (!container) return;
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 260, height: 260 } },
        async (decoded) => {
          if (decoded === lastScannedRef.current) return;
          lastScannedRef.current = decoded;
          try {
            const res = await attendanceService.scan({ qrToken: decoded });
            setLast(res);
            if (res.status === 'marked') toast.success(`Marked ${res.student.name}`);
            else if (res.status === 'already_marked') toast('Already marked', { icon: 'ℹ️' });
          } catch (err) {
            toast.error((err as Error).message);
          }
          setTimeout(() => {
            lastScannedRef.current = '';
          }, 2500);
        },
        () => undefined,
      );
      setRunning(true);
    } catch (err) {
      toast.error((err as Error).message || 'Camera unavailable');
    }
  }

  async function stop() {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => undefined);
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setRunning(false);
  }

  return (
    <div>
      <PageHeader
        title="QR Attendance"
        subtitle="Point the camera at each student's QR badge"
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Attendance', href: '/attendance' },
          { label: 'QR Scan' },
        ]}
      />

      <Card padding="md">
        <div
          style={{
            position: 'relative',
            aspectRatio: '4 / 3',
            background: '#0F172A',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <div id="qr-reader" style={{ width: '100%', height: '100%' }} />
          {!running && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.8)',
                gap: 12,
              }}
            >
              <Camera size={48} />
              <div style={{ fontSize: 14 }}>Camera is off</div>
              <Button onClick={start}>Start camera</Button>
            </div>
          )}
          {running && (
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: ['0%', '100%', '0%'] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                left: 16,
                right: 16,
                height: 2,
                background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
                boxShadow: '0 0 12px #3b82f6',
              }}
            />
          )}
        </div>

        {running && (
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="secondary" leftIcon={<X size={14} />} onClick={stop}>
              Stop
            </Button>
          </div>
        )}
      </Card>

      <AnimatePresence>
        {last && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            style={{ marginTop: 16 }}
          >
            <Card padding="md">
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Avatar name={last.student.name} src={last.student.photoUrl} size={56} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>{last.student.name}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                    Roll {last.student.rollNo ?? '—'}
                  </div>
                </div>
                {last.status === 'marked' && (
                  <Badge variant="success">
                    <Check size={14} /> Marked present
                  </Badge>
                )}
                {last.status === 'already_marked' && (
                  <Badge variant="info">
                    <AlertCircle size={14} /> Already marked
                  </Badge>
                )}
                {last.status === 'no_active_session' && (
                  <Badge variant="warning">No session today</Badge>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
