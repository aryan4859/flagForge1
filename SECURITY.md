# 🔒 Security Policy

## About FlagForge Security

FlagForge is a Capture The Flag (CTF) platform that manages **user authentication, challenge data, and competitive scoring systems**. Given the nature of cybersecurity competitions and the sensitive data we handle, **security is at the core of our platform’s design and operations**.

## Supported Versions

| Version | Supported | Notes                              |
| ------- | --------- | ---------------------------------- |
| 2.0.0   | ✅        | Current development version        |
| < 2.1.0 | ❌        | Pre-release versions not supported |

## Security Architecture

### 🔐 Authentication & Authorization

- Google OAuth integration via NextAuth.js
- Session-based authentication with secure cookies
- Role-based access control (user, moderator, admin)

### 🗄️ Data Security

- Encrypted MongoDB connections
- Input validation & sanitization across all entry points
- Secure flag validation with anti-timing attack protections

### 🛡️ Infrastructure Security

- Hosted on Vercel with enforced HTTPS
- Secure CI/CD pipelines via CircleCI
- Secrets and environment variable isolation for sensitive configs

---

## ⚠️ Responsible Testing Notice

🚨 **Do not test on our production domain (`flagforgectf.com`)**.  
For all vulnerability testing, please use our **dedicated staging environment**:

👉 **[staging.flagforgectf.com](https://staging.flagforgectf.com)**

This ensures testing does not affect live users or disrupt ongoing competitions.

---

## Reporting Security Vulnerabilities

### ✅ In Scope

- Authentication & authorization bypasses
- Injection vulnerabilities (SQL/NoSQL injection, XSS, etc.)
- Server-Side Request Forgery (SSRF)
- Information disclosure & sensitive data leaks
- Challenge manipulation / flag extraction
- Leaderboard tampering
- Session management flaws

### ❌ Out of Scope

- Social engineering attacks
- Physical security issues
- Third-party service vulnerabilities (Google OAuth, Vercel, etc.)
- DoS/DDoS or brute-force attacks
- Issues requiring physical access to infrastructure

### How to Report
 

**Please include**:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact assessment
4. Proof of concept (if applicable)
5. Suggested remediation (optional)

---

## Response Process

1. **Acknowledgment** – within 24 hours
2. **Initial Assessment** – within 7 days
3. **Weekly Updates** – provided during investigation
4. **Resolution** – dependent on severity
5. **Coordinated Disclosure** – after patch deployment

---

## Severity Classification

- **Critical**: Immediate compromise, sensitive data breach, or challenge integrity violation
- **High**: Privilege escalation, authentication bypass, or significant exposure
- **Medium**: Information disclosure, sanitization flaws
- **Low**: Minor misconfigurations, low-impact leaks

---

## Security Best Practices for Contributors

### Code Security

- Validate and sanitize all inputs
- Use parameterized queries
- Handle errors gracefully (no sensitive debug info)
- Keep dependencies updated
- Follow secure coding guidelines (OWASP Top 10, CWE)

### Authentication

- Never hardcode credentials in code
- Use environment variables for secrets
- Implement strict session handling
- Follow OAuth & cookie best practices

### CTF-Specific Security

- Rate-limit flag submissions
- Harden flag validation against timing attacks
- Store challenge files securely
- Ensure challenge isolation between users

---

## Incident Response

In the event of a confirmed incident:

1. Immediate containment actions
2. User notification (if applicable)
3. Root cause analysis
4. Patch & remediation
5. Post-incident review & policy updates

---

## Security Contact

📧 **Primary Contact**: security@flagforgectf.com
🐙 **GitHub Issues**: For non-sensitive discussions  
⏱ **Response Time**: 24 hours for acknowledgment

---

## Compliance and Standards

FlagForge adheres to:

- **OWASP Secure Coding Guidelines**
- **Secure SDLC practices**
- **Regular penetration testing & assessments**
- **Automated dependency & vulnerability scanning**

---

## Recognition

We value the contributions of the security community. Researchers who responsibly disclose vulnerabilities may receive:

- Public acknowledgment (with consent)
- Credit in release notes
- A permanent spot in the **[Hall of Fame](https://github.com/FlagForgeCTF/flagForge/blob/mainv2/HALL-OF-FAME.md)**

---

_Last Updated: September 2025_  
_Next Review: June 2026_
