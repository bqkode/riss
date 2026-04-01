# AI Generation Guidelines for RissBlocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## When to use blocks vs. raw elements

**Use blocks when:**
- The pattern matches a core block closely (hero, feature-grid, pricing-table, etc.)
- You want consistent, best-practice layout
- The screen structure should be quickly scannable by a human

**Use raw elements when:**
- The section is highly custom or doesn't match any block pattern
- You need precise control over layout that block parameters don't expose
- You're building something the blocks weren't designed for

**Mixing is encouraged.** A screen can contain both blocks and raw elements:

```yaml
children:
  - block: top-nav
    logo: "MyApp"
    items: [...]

  - block: hero
    heading: "Welcome"

  # Custom section using raw elements
  - type: stack
    padding: xl
    children:
      - type: text
        variant: h2
        content: "Something unique"
      - type: row
        # ... custom layout

  - block: footer
    variant: simple
```

---

## Block generation rules

1. **Prefer blocks over manual construction.** If a section maps to a core block, use the block.
2. **Blocks are direct screen children only.** Do not nest blocks inside blocks, or place blocks inside `stack`, `row`, `grid`, or other layout elements. If you need to arrange blocks side-by-side, use raw elements instead.
3. **Use realistic content.** Fill block parameters with realistic data, not "Lorem ipsum".
4. **Override only what you need.** Rely on defaults for parameters you don't need to customize.
5. **Annotate custom behavior.** If a block needs behavior the parameters don't express, add an `annotation`.
6. **Keep parameter count reasonable.** When defining custom blocks, aim for 3-8 parameters. If you need more, the pattern might be too complex for a single block.
7. **Use the standard icon set.** Block parameters that accept icon names use the same icon set defined in [RISS_SPEC.md section 6](../RISS_SPEC.md#63-content-elements). Unrecognized icon names render as a small labeled square.

---

## Full page example with blocks

```yaml
riss: "0.1"

meta:
  name: "SaaSLanding"
  viewport: { width: 1440, height: 900 }
  theme:
    mode: light
    accent: "#6366F1"

screens:
  - id: landing
    title: "Landing Page"
    children:
      - block: announcement-bar
        message: "We just raised our Series A! Read the story →"

      - block: top-nav
        logo: "Acme"
        items:
          - label: "Product"
          - label: "Pricing"
          - label: "Docs"
          - label: "Blog"
        cta-label: "Sign Up"
        cta-secondary-label: "Log In"

      - block: hero
        variant: split
        heading: "The developer platform for modern teams"
        subheading: "Build, deploy, and scale without the infrastructure headaches."
        cta-label: "Start Free"
        cta-secondary-label: "Watch Demo"
        image-label: "Dashboard Screenshot"

      - block: logo-bar
        title: "Trusted by 2,000+ teams"
        logos: 6
        labels: ["Vercel", "Stripe", "Linear", "Notion", "Figma", "Supabase"]

      - block: feature-grid
        title: "Everything you need"
        subtitle: "A complete platform from prototype to production."
        columns: 3
        items:
          - icon: refresh
            title: "Instant Deploys"
            description: "Push to git and your app is live in seconds."
          - icon: lock
            title: "Secure by Default"
            description: "SOC 2, encryption at rest, and role-based access."
          - icon: users
            title: "Team Collaboration"
            description: "Real-time editing, comments, and branch previews."
          - icon: chart
            title: "Built-in Analytics"
            description: "Track performance without third-party scripts."
          - icon: settings
            title: "Fully Configurable"
            description: "Customize everything from build to runtime."
          - icon: globe
            title: "Global Edge Network"
            description: "Fast everywhere, with 50+ edge locations."

      - block: alternating-rows
        items:
          - heading: "Ship faster"
            body: "Zero-config deploys mean less time on DevOps and more time building features your users love."
            image-label: "Deploy Flow Screenshot"
            cta-label: "See how it works"
          - heading: "Scale effortlessly"
            body: "Auto-scaling infrastructure handles traffic spikes so you don't have to page your oncall."
            image-label: "Scaling Dashboard"
          - heading: "Debug in production"
            body: "Real-time logs, traces, and error tracking built directly into the platform."
            image-label: "Debug Console"

      - block: stats-row
        items:
          - value: "2,000+"
            label: "Teams"
          - value: "50M"
            label: "Deploys"
          - value: "99.99%"
            label: "Uptime"
          - value: "4.9/5"
            label: "Satisfaction"

      - block: testimonial-grid
        title: "Loved by developers"
        columns: 3
        items:
          - quote: "Migrating to Acme cut our deploy times by 80%. The DX is unmatched."
            author: "Sarah Chen"
            role: "CTO, Startupify"
          - quote: "Finally, infrastructure that gets out of my way."
            author: "Marcus Johnson"
            role: "Senior Engineer, ScaleUp"
          - quote: "The best investment our engineering team made this year."
            author: "Anna Björk"
            role: "VP Engineering, NordicTech"

      - block: pricing-table
        title: "Simple, transparent pricing"
        subtitle: "No hidden fees. Cancel anytime."
        toggle: ["Monthly", "Annual"]
        tiers:
          - name: "Hobby"
            price: "$0"
            period: "/month"
            description: "For personal projects."
            features: ["1 project", "100K requests/mo", "Community support"]
            cta-label: "Get Started"
            cta-variant: outline
          - name: "Pro"
            price: "$29"
            period: "/month"
            description: "For growing teams."
            features: ["Unlimited projects", "10M requests/mo", "Priority support", "Custom domains"]
            cta-label: "Start Free Trial"
            highlighted: true
          - name: "Enterprise"
            price: "Custom"
            description: "For organizations at scale."
            features: ["Everything in Pro", "SSO & SAML", "SLA", "Dedicated support"]
            cta-label: "Contact Sales"
            cta-variant: outline

      - block: accordion
        title: "Frequently Asked Questions"
        items:
          - question: "Do I need a credit card to start?"
            answer: "No, the Hobby plan is completely free with no credit card required."
          - question: "Can I switch plans later?"
            answer: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately."
          - question: "What happens if I exceed my request limit?"
            answer: "We'll notify you and your app stays online. You can upgrade or we'll discuss options."
          - question: "Do you offer a startup discount?"
            answer: "Yes! Startups with under $5M in funding get 50% off Pro for the first year."

      - block: cta-banner
        heading: "Ready to ship faster?"
        subheading: "Join 2,000+ teams building on Acme."
        cta-label: "Start Free"
        cta-secondary-label: "Talk to Sales"
        background: accent-soft

      - block: footer
        variant: multi-column
        logo: "Acme"
        tagline: "The developer platform for modern teams."
        columns:
          - title: "Product"
            links: ["Features", "Pricing", "Changelog", "Status"]
          - title: "Developers"
            links: ["Documentation", "API Reference", "CLI", "Examples"]
          - title: "Company"
            links: ["About", "Blog", "Careers", "Contact"]
          - title: "Legal"
            links: ["Privacy", "Terms", "DPA", "Security"]
        social: ["twitter", "github", "linkedin", "discord"]
        copyright: "© 2026 Acme Inc. All rights reserved."
```
