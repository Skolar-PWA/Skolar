import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@eduportal/ui';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, GraduationCap, Sparkles, LogIn } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

// Validation Schema
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
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      background: '#F8FAFC'
    }}>

      {/* LEFT SIDE: Animated Hero Theme with Background Image + Waves */}
      <div style={{
        flex: 1.2,
        background: `linear-gradient(135deg, rgba(2, 136, 209, 0.85) 0%, rgba(79, 195, 247, 0.7) 100%), url('/assets/illustrations/schoolBg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden',
        color: '#fff'
      }}>
        {/* Animated Waves Container */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '30%',
          zIndex: 1,
          pointerEvents: 'none'
        }}>
          {/* Wave 1 */}
          <motion.svg
            viewBox="0 0 1440 320"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0.3
            }}
            animate={{
              x: ['0%', '-5%', '0%', '5%', '0%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path
              fill="rgba(255,255,255,0.4)"
              d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,208C960,213,1056,203,1152,186.7C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </motion.svg>

          {/* Wave 2 */}
          <motion.svg
            viewBox="0 0 1440 320"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '80%',
              opacity: 0.2
            }}
            animate={{
              x: ['0%', '3%', '0%', '-3%', '0%'],
              y: ['0%', '-2%', '0%', '2%', '0%']
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path
              fill="rgba(255,255,255,0.3)"
              d="M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,197.3C672,213,768,235,864,229.3C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </motion.svg>

          {/* Wave 3 */}
          <motion.svg
            viewBox="0 0 1440 320"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0.15
            }}
            animate={{
              scaleX: [1, 1.02, 1, 0.98, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path
              fill="rgba(255,255,255,0.5)"
              d="M0,128L48,138.7C96,149,192,171,288,181.3C384,192,480,192,576,176C672,160,768,128,864,138.7C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </motion.svg>
        </div>

        {/* Animated Background Circles for Depth - Increased opacity for darker effect */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360, scale: [1, 1.05, 1], x: [0, 15, 0], y: [0, -15, 0] }}
            transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              width: 300 + i * 150,
              height: 300 + i * 150,
              border: '2px solid rgba(255,255,255,0.3)', // Opacity increased from 0.1 to 0.3
              borderRadius: i === 1 ? '40% 60% 70% 30% / 40% 50% 60% 70%' : '50%',
              top: i === 0 ? '-10%' : i === 1 ? '40%' : 'auto',
              bottom: i === 2 ? '-10%' : 'auto',
              right: i === 0 ? '-5%' : 'auto',
              left: i === 1 ? '-10%' : '20%',
              pointerEvents: 'none'
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 32,
            background: 'rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: '50px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            {/* <Sparkles size={18} /> */}
            <span style={{ fontSize: 14, fontWeight: 600 }}>Pakistan's #1 School App</span>
          </div>
          <h1 style={{
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 24,
            letterSpacing: '-1.5px',
            textShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            Streamline Your <br />
            <span style={{ color: '#E3F2FD', fontSize: '40px' }}>
              School Operations
            </span>

          </h1>
          <p style={{
            fontSize: 20,
            opacity: 0.95,
            lineHeight: 1.6,
            textShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            Everything you need to manage attendance, fees, and results in one seamless dashboard.
          </p>
        </motion.div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: '#fff'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            width: '100%',
            maxWidth: '440px',
            padding: '40px',
            borderRadius: '24px',
            background: '#fff',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
            border: '1px solid #F1F5F9'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              background: '#E1F5FE', color: '#0288D1',
              width: 56, height: 56, borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <GraduationCap size={32} />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>
              Welcome Back
            </h2>
            <p style={{ color: '#64748B', fontSize: 14 }}>
              Login to access your School Portal
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <Input
              label="Email or Phone"
              placeholder="admin@demo.pk"
              leftIcon={<Mail size={18} color="#94A3B8" />}
              error={errors.identifier?.message}
              {...register('identifier')}
              className="login-input"
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              leftIcon={<Lock size={18} color="#94A3B8" />}
              error={errors.password?.message}
              {...register('password')}
              className="login-input"
            />

            <div style={{ textAlign: 'right' }}>
              <button type="button" style={{
                background: 'none', border: 'none',
                color: '#0288D1', fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}>
                Forgot password?
              </button>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} style={{ marginTop: 8 }}>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} style={{ marginTop: 8 }}>
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  style={{
                    background: '#0288D1',
                    borderRadius: '12px',
                    height: '52px',
                    fontSize: '16px',
                    fontWeight: 600,
                    boxShadow: '0 8px 20px rgba(2, 136, 209, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  {!isSubmitting && <LogIn size={20} />}
                  Sign In
                </Button>
              </motion.div>
            </motion.div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}