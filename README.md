[https://studentvoiceplatform.web.app](url) This is the link for my website...
Student Voice Platform
This project is an anonymous feedback and communication platform designed for students to securely submit concerns and receive updates. It aims to provide a transparent and efficient channel for addressing student issues within an educational institution.

Key Features:

Anonymous Report Submission: Students can submit detailed reports on various categories (e.g., Harassment, Academic, Infrastructure) with an optional image attachment.

Instant AI Advice: Integrates the Google Gemini API to provide immediate, supportive, and constructive advice to students based on their submitted concerns.

Real-time Report Tracking: Students receive a unique tracking ID to monitor the status of their reports and view conversation threads with administrators.

Comprehensive Admin Dashboard: Administrators gain a powerful interface to:

View all submitted reports in real-time.

Access analytics, including total, pending, and resolved report counts.

Visualize report distribution by category and status using interactive charts.

Update report statuses (e.g., Submitted, Under Investigation, Resolved).

Engage in a direct conversation thread with students for clarification or resolution.

View attached images for each report.

Technologies Used:

Frontend: HTML, JavaScript, Tailwind CSS (for a modern, responsive UI), Chart.js (for data visualization).

Backend (API Proxy): Node.js hosted on Render (securely proxies Google Gemini API calls, keeping the API key confidential).

Database & Authentication: Google Firebase (Firestore for real-time data storage, Authentication for anonymous user access).

AI Integration: Google Gemini API (for generating advice and summaries).

Hosting: Firebase Hosting.

Security & Privacy:

The platform prioritizes student anonymity during submission and ensures the Gemini API key is securely handled via a dedicated backend service, preventing its exposure in client-side code. While student submissions are anonymous, the admin panel currently uses anonymous authentication for demonstration; for production, a robust admin login system is recommended.
