# Security Policy  
  
## About flagForge Security  
  
flagForge is a Capture The Flag (CTF) platform that handles user authentication, challenge data, and competitive scoring systems. Security is paramount given the nature of CTF competitions and the sensitive user data we manage.  
  
## Supported Versions  
  
| Version | Supported          | Notes |  
| ------- | ------------------ | ----- |  
| 2.0.0   | :white_check_mark: | Current development version |  
| < 0.1.0 | :x:               | Pre-release versions not supported |  
  
## Security Architecture  
  
### Authentication & Authorization  
- Google OAuth integration via NextAuth.js  
- Session-based authentication  
- Role-based access control for challenges and administration  
  
### Data Security  
- MongoDB database with encrypted connections  
- Input validation and sanitization for all user inputs  
- Secure flag validation mechanisms to prevent timing attacks  
  
### Infrastructure Security  
- Hosted on Vercel with HTTPS enforcement  
- CircleCI integration for secure CI/CD  
- Environment variable management for sensitive configurations  
  
## Reporting Security Vulnerabilities  
  
### Scope  
Security vulnerabilities in the following areas are in scope:  
- Authentication and authorization bypasses  
- Data injection vulnerabilities (SQL/NoSQL injection, XSS, etc.)  
- Server-side request forgery (SSRF)  
- Information disclosure  
- CTF challenge manipulation or flag extraction  
- Leaderboard tampering  
- Session management issues  
  
### Out of Scope  
- Social engineering attacks  
- Physical security issues  
- Third-party service vulnerabilities (Google OAuth, Vercel, etc.)  
- DoS/DDoS attacks  
- Issues requiring physical access to infrastructure  
  
### How to Report  
  
**Email**: contact@aryan4.com.np  
**Subject**: [SECURITY] Vulnerability Report - flagForge  
  
**Include**:  
1. Detailed vulnerability description  
2. Steps to reproduce  
3. Potential impact assessment  
4. Proof of concept (if applicable)  
5. Suggested remediation (optional)  
  
### Response Process  
  
1. **Acknowledgment**: Within 24 hours  
2. **Initial Assessment**: Within 7 days  
3. **Progress Updates**: Weekly during investigation  
4. **Resolution**: Timeline varies by severity  
5. **Disclosure**: Coordinated disclosure after fix deployment  
  
### Severity Classification  
  
**Critical**: Immediate system compromise, data breach, or CTF integrity violation  
**High**: Privilege escalation, authentication bypass, or significant data exposure  
**Medium**: Information disclosure, input validation issues  
**Low**: Configuration issues, minor information leaks  
  
## Security Best Practices for Contributors  
  
### Code Security  
- Validate all user inputs  
- Use parameterized queries  
- Implement proper error handling  
- Follow secure coding guidelines  
- Regular dependency updates  
  
### Authentication  
- Never store credentials in code  
- Use environment variables for secrets  
- Implement proper session management  
- Follow OAuth best practices  
  
### CTF-Specific Security  
- Implement flag submission rate limiting  
- Prevent timing attacks on flag validation  
- Secure challenge file storage  
- Implement proper challenge isolation  
  
## Incident Response  
  
In case of a confirmed security incident:  
1. Immediate containment measures  
2. User notification (if required)  
3. Root cause analysis  
4. Remediation implementation  
5. Post-incident review and policy updates  
  
## Security Contact  
  
For security-related inquiries:  
- **Primary Contact**: contact@aryan4.com.np  
- **GitHub Issues**: For non-sensitive security discussions  
- **Response Time**: 24 hours for acknowledgment  
  
## Compliance and Standards  
  
flagForge follows:  
- OWASP security guidelines  
- Secure development lifecycle practices  
- Regular security assessments  
- Dependency vulnerability scanning  
  
## Recognition  
  
Security researchers who responsibly disclose vulnerabilities may receive:  
- Public acknowledgment (with permission)  
- Credit in release notes  
- Contribution recognition in our hall of fame  
  
---  
  
*Last Updated: September 2025*  
*Next Review: June 2026*
