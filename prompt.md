# User Prompts History

This document chronicles all user prompts submitted during the development of the Singapore Civic Transit application.

---

### Prompt 1: Initial App Design & Specification
```text
Build me an app with screens that look like this. You can hotlink images from the html
```

*(Accompanied by the Singapore Civic Transit Design System specification: SBS Transit magenta/purple & transit orange color palettes, LTA occupancy indicators, Space Grotesk and Inter typography, three-tier arrival list rows, route explorer, MRT rail advisories, and civic alert cards.)*

---

### Prompt 2: GitHub Repository Push
```text
git push https://[REDACTED_GITHUB_TOKEN]@github.com/ivyivy-py/mcp-bus.git
```
*(Token redacted to prevent automated credential revocation by GitHub Secret Scanning)*

---

### Prompt 3: API Architecture & LTA DataMall Integration
```text
1) create a /api folder under the project main to store all the apis
2) create a /api/health.js to monitor if the apis are working
3) integrate the LTA bus information api endpoint GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=04121
Header:  AccountKey: 

# BusStopCode is the only required parameter.
# Add &ServiceNo=7 to ask about one service only.
# Refreshes every 20 seconds. JSON comes back by default.
i will add the LTA_ACCOUNT_KEY in vercel environment variables later
```

---

### Prompt 4: Prompts Documentation
```text
create a prompt.md containing all my prompts located at project main
```
