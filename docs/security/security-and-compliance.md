---
title: Protekt Security and Compliance
sidebar_position: 1
---

Protekt is built with security and compliance as foundational principles, not afterthoughts. From how user data is processed to how authentication flows are secured, every layer of the platform is designed to meet modern security standards and regulatory expectations.

This page provides an overview of Protekt’s approach to data privacy, regulatory compliance, and industry certifications. It also outlines how Protekt helps you meet your own compliance obligations when building secure, user-facing applications.

## Data Privacy and Protection

Protekt is designed to minimize the amount of sensitive data you need to manage directly. By handling authentication, tokenization, and session management on your behalf, Protekt reduces your exposure to common security risks and compliance burdens.

All sensitive data is encrypted both in transit (via HTTPS/TLS) and at rest using industry-standard encryption mechanisms. Protekt follows strict data isolation practices, ensuring that customer data is logically separated and protected against unauthorized access.

### Data Processing

Protekt only processes data necessary to provide authentication and identity services. This includes user identifiers (such as email), authentication credentials (securely hashed or tokenized), and session metadata.

Data is never sold or shared with third parties for marketing purposes. Any data processing performed by Protekt is strictly limited to delivering authentication functionality, improving security, and maintaining service reliability.



## Compliance and Certifications

Protekt is designed to align with globally recognized compliance frameworks and security standards. While certifications may vary depending on deployment and customer requirements, Protekt continuously evolves to meet industry expectations.

If you require compliance documentation (such as audit reports or agreements), these can be requested through the Protekt support channel.

### FAPI (Financial-grade API)

Protekt supports the technical requirements of **Financial-grade API (FAPI)**, a set of enhanced security profiles defined by the OpenID Foundation. FAPI builds on OAuth 2.0 and OpenID Connect to provide stronger guarantees around authentication and authorization.

This makes Protekt suitable for high-security environments such as financial services, open banking, and regulated APIs, where stricter controls like mutual TLS (mTLS) and signed requests are required.

### GDPR (General Data Protection Regulation)

Protekt is designed to support compliance with the **General Data Protection Regulation (GDPR)**. It provides tools and features that help you manage user data responsibly and transparently.

This includes capabilities such as user data access, correction, and deletion, as well as clear data processing boundaries. While Protekt provides the infrastructure, customers remain responsible for ensuring their own applications comply with GDPR requirements.

### HIPAA and HITECH

Protekt can support workloads that fall under **HIPAA (Health Insurance Portability and Accountability Act)** and **HITECH** regulations, depending on configuration and usage.

For customers handling electronic Protected Health Information (ePHI), Protekt may operate as a *Business Associate*. In such cases, a Business Associate Agreement (BAA) can be provided upon request. It is the responsibility of the customer to ensure proper configuration and usage in accordance with healthcare regulations.

### CSA STAR

Protekt aligns with the **Cloud Security Alliance (CSA) STAR** program, which promotes transparency in cloud security practices.

Through standardized assessments and documentation, Protekt demonstrates adherence to industry-recognized security controls. Customers can request relevant documentation to better understand Protekt’s security posture.

### ISO 27001 / 27017 / 27018

Protekt follows the principles outlined in **ISO 27001**, **ISO 27017**, and **ISO 27018**, which cover information security management, cloud security, and protection of personally identifiable information (PII).

These standards guide how Protekt manages risk, enforces access controls, and protects sensitive data. Regular internal reviews and independent audits help ensure continued alignment with these frameworks.

### PCI DSS

Protekt supports deployment patterns that can be used in **PCI DSS (Payment Card Industry Data Security Standard)**-compliant environments.

While Protekt does not store or process raw card data, it plays a role in securing authentication flows within payment systems. Customers building payment-related applications should ensure their overall architecture meets PCI requirements.

### PSD2 (Payment Services Directive 2)

Protekt provides the building blocks required for **PSD2** compliance, particularly around Strong Customer Authentication (SCA).

Features like multi-factor authentication (MFA), transaction verification, and secure session handling enable developers to implement compliant payment flows that meet regulatory standards in regions where PSD2 applies.

### SOC 2

Protekt is designed to align with **SOC 2** Trust Service Criteria, including Security, Availability, Processing Integrity, Confidentiality, and Privacy.

Operational processes, infrastructure controls, and monitoring systems are structured to meet these criteria. Audit reports and supporting documentation can be made available upon request.

## Security Architecture

Protekt’s architecture is built around a zero-trust model, where every request must be authenticated and validated before access is granted. Tokens are short-lived, sessions are tightly controlled, and all communication is encrypted.

Additional safeguards include anomaly detection, rate limiting, and audit logging. These features help detect and respond to suspicious activity, providing an extra layer of protection for your users and systems.

## Shared Responsibility Model

Security in Protekt follows a **shared responsibility model**. Protekt is responsible for securing the platform, infrastructure, and core authentication mechanisms.

As a developer, you are responsible for securely integrating Protekt into your application. This includes proper token handling, enforcing HTTPS, implementing access controls, and configuring authentication flows according to your requirements.

Understanding this division ensures that both Protekt and your application work together to maintain a strong security posture.

## Specifications

Protekt adheres to widely adopted authentication and authorization standards, including:

- OAuth 2.0  
- OpenID Connect (OIDC)  
- JSON Web Tokens (JWT)  

For more details on supported protocols and implementation guides, see the Protocols documentation.