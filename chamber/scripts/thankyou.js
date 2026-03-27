function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const summary = document.getElementById("applicationSummary");

    if (!summary) {
        return;
    }

    const firstName = params.get("firstName")?.trim();
    const lastName = params.get("lastName")?.trim();
    const email = params.get("email")?.trim();
    const mobile = params.get("mobile")?.trim();
    const businessName = params.get("businessName")?.trim();
    const timestamp = params.get("timestamp")?.trim();

    if (!firstName || !lastName || !email || !mobile || !businessName || !timestamp) {
        summary.innerHTML = `
      <p>We couldn’t load the required application details from your submission. Please return to the <a href="join.html">join page</a> and try again.</p>
    `;
        return;
    }

    summary.innerHTML = `
    <div class="thankyou-card">
      <p>Thanks for applying, <strong>${escapeHtml(firstName)} ${escapeHtml(lastName)}</strong>. Your membership request for <strong>${escapeHtml(businessName)}</strong> has been received.</p>
      <dl class="summary-list">
        <div class="summary-item"><dt>First name</dt><dd>${escapeHtml(firstName)}</dd></div>
        <div class="summary-item"><dt>Last name</dt><dd>${escapeHtml(lastName)}</dd></div>
        <div class="summary-item"><dt>Email address</dt><dd>${escapeHtml(email)}</dd></div>
        <div class="summary-item"><dt>Mobile number</dt><dd>${escapeHtml(mobile)}</dd></div>
        <div class="summary-item"><dt>Business name</dt><dd>${escapeHtml(businessName)}</dd></div>
        <div class="summary-item"><dt>Application submitted</dt><dd>${escapeHtml(timestamp)}</dd></div>
      </dl>
    </div>
  `;
});
