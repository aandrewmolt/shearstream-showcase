import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { ArrowRight, Zap, Shield, Sparkles, Activity, Database, Rocket, Code } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 6,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-dark-50 via-primary-950 to-dark-50 text-white overflow-hidden">
      {/* Animated Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-petroleum-600/30 blur-sm"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold text-petroleum-400 glow-border"
            >
              <Sparkles className="h-5 w-5 animate-pulse-slow" />
              Next-Generation Monitoring Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6 text-6xl font-bold tracking-tight sm:text-8xl"
            >
              ShearStream
              <span className="block gradient-text mt-2">Reimagined</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-12 text-xl leading-8 text-gray-300 max-w-3xl mx-auto"
            >
              From legacy monitoring to <span className="text-petroleum-500 font-semibold">cutting-edge real-time analytics</span>.
              <span className="block mt-2">Transforming oil & gas field operations with modern technology.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/dashboard/746"
                className="group relative inline-flex items-center gap-2 rounded-lg bg-petroleum-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl hover:bg-petroleum-700 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Activity className="h-5 w-5 animate-pulse" />
                  View Live Dashboard
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-petroleum-500 to-petroleum-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <a
                href="#journey"
                className="inline-flex items-center gap-2 rounded-lg glass border-2 border-petroleum-600/50 px-8 py-4 text-lg font-semibold text-white hover:bg-petroleum-600/10 transition-all hover:border-petroleum-600"
              >
                See The Journey
                <Zap className="h-5 w-5" />
              </a>
            </motion.div>
          </motion.div>

          {/* Floating Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-20"
          >
            <div className="relative mx-auto max-w-5xl rounded-2xl glass p-1 glow-border animate-float">
              <div className="rounded-xl bg-dark-50 p-4">
                <div className="aspect-video bg-gradient-to-br from-primary-950 to-dark-100 rounded-lg flex items-center justify-center text-gray-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                  <div className="relative z-10 text-center">
                    <Activity className="h-16 w-16 mx-auto mb-4 text-petroleum-500 animate-pulse" />
                    <p className="text-xl font-semibold">Live Dashboard Preview</p>
                    <p className="text-sm text-gray-400 mt-2">Real-time monitoring in action</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Animated CountUp */}
      <section className="relative border-y border-petroleum-600/20 bg-dark-50/50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center glass p-6 rounded-xl glow-border"
            >
              <div className="text-5xl font-bold gradient-text mb-2">
                <CountUp end={98} duration={2.5} suffix="%" />
              </div>
              <div className="text-sm text-gray-400 font-semibold">Performance Boost</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center glass p-6 rounded-xl glow-border"
            >
              <div className="text-5xl font-bold gradient-text mb-2">
                <CountUp end={2} duration={2.5} decimals={0} suffix="s" />
              </div>
              <div className="text-sm text-gray-400 font-semibold">Data Refresh Rate</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center glass p-6 rounded-xl glow-border"
            >
              <div className="text-5xl font-bold gradient-text mb-2">
                <CountUp end={12} duration={2.5} suffix="+" />
              </div>
              <div className="text-sm text-gray-400 font-semibold">Live Data Channels</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center glass p-6 rounded-xl glow-border"
            >
              <div className="text-5xl font-bold gradient-text mb-2">
                <CountUp end={100} duration={2.5} suffix="%" />
              </div>
              <div className="text-sm text-gray-400 font-semibold">Mobile Optimized</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section id="journey" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
          >
            <h2 className="mb-4 text-5xl font-bold">The Transformation Journey</h2>
            <p className="text-xl text-gray-400">
              A complete modernization from capture to deployment
            </p>
          </motion.div>

          <div className="space-y-16">
            {[
              {
                icon: Database,
                title: 'Data Capture & Analysis',
                description: 'Used Chrome DevTools MCP to systematically capture all API endpoints, data structures, and user flows from production ShearStream. Analyzed 34 GET requests capturing 525KB of structured data.',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Code,
                title: 'Architecture Design',
                description: 'Designed a metadata-driven architecture handling the unique nature of oil & gas jobs - every job has different channels, units, and naming conventions. Built flexibility into the core.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: Rocket,
                title: 'Modern Implementation',
                description: 'Built with React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, and Recharts. PWA-enabled for mobile app experience. Real-time data visualization with smooth animations.',
                color: 'from-orange-500 to-red-500',
              },
              {
                icon: Shield,
                title: 'Quality Assurance',
                description: 'Validated with complete-test-v2 by Andrew Molt - automated testing for performance, accessibility, and code quality. Zero console errors, optimized bundle, production-ready.',
                color: 'from-green-500 to-emerald-500',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative flex gap-8 items-start group"
              >
                <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-2xl font-bold shadow-xl group-hover:scale-110 transition-transform`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 glass p-6 rounded-xl hover:bg-white/10 transition-all">
                  <h3 className="mb-3 text-2xl font-semibold text-petroleum-400">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MCP Tools Section */}
      <section className="border-t border-petroleum-600/20 bg-dark-50/30 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
          >
            <h2 className="mb-4 text-5xl font-bold">Powered by MCP Servers</h2>
            <p className="text-xl text-gray-400">
              Model Context Protocol tools that made this possible
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'complete-test-v2',
                author: 'Andrew Molt',
                description: 'Comprehensive automated testing with quality gates and iterative fix loops. Validates performance, accessibility, and code quality.',
                featured: true,
              },
              {
                name: 'Chrome DevTools MCP',
                description: 'Browser automation for testing, screenshots, network analysis, and console monitoring.',
              },
              {
                name: 'Memory MCP',
                description: 'Persistent knowledge graph for storing entities, relations, and observations across sessions.',
              },
              {
                name: 'GitHub MCP',
                description: 'Repository management, file operations, and version control integration.',
              },
              {
                name: 'REST API MCP',
                description: 'Test and interact with REST endpoints with authentication and request/response handling.',
              },
              {
                name: 'Git MCP',
                description: 'Read, search, and manipulate Git repositories for source control operations.',
              },
            ].map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`glass p-6 rounded-xl hover:bg-white/10 transition-all ${
                  tool.featured ? 'md:col-span-2 lg:col-span-3 glow-border' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${tool.featured ? 'bg-gradient-to-br from-petroleum-500 to-orange-600' : 'bg-primary-900'} flex items-center justify-center`}>
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`mb-2 ${tool.featured ? 'text-3xl' : 'text-xl'} font-bold text-petroleum-400`}>
                      {tool.name}
                    </h3>
                    {tool.author && (
                      <p className="mb-2 text-sm text-petroleum-500 font-semibold">
                        Created by {tool.author}
                      </p>
                    )}
                    <p className={`text-gray-300 ${tool.featured ? 'text-lg' : 'text-sm'}`}>
                      {tool.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-400 mb-4">Discover more MCP servers:</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://mcpservers.org/official"
                target="_blank"
                rel="noopener noreferrer"
                className="glass px-6 py-3 rounded-lg hover:bg-white/10 transition-all inline-flex items-center gap-2 border border-petroleum-600/30"
              >
                Official MCP Registry
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://github.com/punkpeye/awesome-mcp-servers"
                target="_blank"
                rel="noopener noreferrer"
                className="glass px-6 py-3 rounded-lg hover:bg-white/10 transition-all inline-flex items-center gap-2 border border-petroleum-600/30"
              >
                Awesome MCP Servers
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-12 rounded-2xl text-center glow-border"
          >
            <h2 className="mb-4 text-4xl font-bold">Ready to See It in Action?</h2>
            <p className="mb-8 text-xl text-gray-300">
              Experience the future of oil & gas field monitoring
            </p>
            <Link
              to="/dashboard/746"
              className="inline-flex items-center gap-2 rounded-lg bg-petroleum-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl hover:bg-petroleum-700 transition-all hover:scale-105"
            >
              <Activity className="h-5 w-5 animate-pulse" />
              Launch Live Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
