import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card } from '@eduportal/ui';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { useEffect } from 'react';

const schema = z.object({
  identifier: z.string().min(3, 'Enter your email or phone'),
  password: z.string().min(6, 'At least 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { user, hydrating, hydrate, login } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrating) hydrate();
  }, [hydrating, hydrate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { identifier: 'admin@demo.pk', password: 'password123' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.identifier, data.password);
      toast.success('Welcome back!');
      const dest = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard';
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error((err as Error).message || 'Login failed');
    }
  };

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="login-layout">
      <div className="login-left">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="login-form-box"
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 24,
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            <div className="sidebar-logo-mark" style={{ width: 36, height: 36, fontSize: 14 }}>
              EP
            </div>
            EduPortal
          </div>

          <h1 className="page-title" style={{ fontSize: 28, marginBottom: 8 }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-700)', marginBottom: 28, fontFamily: 'var(--font-body)' }}>
            Sign in to manage your school, mark attendance, and review results.
          </p>

          <Card padding="lg" style={{ boxShadow: 'var(--shadow-card)' }}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input
                label="Email or phone"
                placeholder="admin@demo.pk"
                leftIcon={<Mail size={16} />}
                error={errors.identifier?.message}
                wrapperClassName="ep-login-input-shell"
                {...register('identifier')}
              />
              <Input
                type="password"
                label="Password"
                placeholder="Your password"
                leftIcon={<Lock size={16} />}
                error={errors.password?.message}
                wrapperClassName="ep-login-input-shell"
                {...register('password')}
              />
              <Button type="submit" size="lg" fullWidth loading={isSubmitting} data-ep-login-submit>
                Sign in
              </Button>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--text-500)',
                  textAlign: 'center',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Demo: admin@demo.pk / password123
              </div>
            </form>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="login-right"
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 70%, #1D4ED8 100%)',
          color: '#fff',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(59,130,246,0.4), transparent)',
            filter: 'blur(40px)',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 480 }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '6px 12px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.1)',
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 24,
            }}
          >
            Built for Pakistan&apos;s schools
          </div>
          <h2
            style={{
              fontSize: 44,
              lineHeight: 1.15,
              color: '#fff',
              marginBottom: 16,
              fontFamily: 'var(--font-heading)',
            }}
          >
            Your school, running smarter.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.75)' }}>
            Attendance, results, fees and parent communication — one app, works offline, installs on any
            phone. From teachers to parents, everyone stays in sync.
          </p>
          <div
            style={{
              marginTop: 32,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
            }}
          >
            {[
              { n: '50+', l: 'Schools live' },
              { n: '25k+', l: 'Students managed' },
              { n: '98%', l: 'Teacher adoption' },
            ].map((s) => (
              <div key={s.l}>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                  {s.n}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
