import re

PII_PATTERNS = [
    # Authorization Bearer & JWT tokens
    (r'Bearer\s+[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.?[A-Za-z0-9\-_.+/=]*', 'Bearer [REDACTED_TOKEN]'),
    (r'\beyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\b', '[REDACTED_JWT]'),
    
    # Passwords and secrets in key-value pairs
    (r'(?i)(password|secret|passcode|auth_token|api_key|access_token)\s*[:=]\s*["\']?([^"\'\s,;]+)["\']?', r'\1=[REDACTED_SECRET]'),
    
    # Credit Card numbers (Visa, MC, Amex, Discover 13-16 digits with optional dashes/spaces)
    (r'\b(?:\d{4}[ -]?){3}\d{4}\b', '[REDACTED_CREDIT_CARD]'),
    
    # Email addresses
    (r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}\b', '[REDACTED_EMAIL]'),
    
    # Phone numbers
    (r'\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b', '[REDACTED_PHONE]'),
]

def scrub_sensitive_text(text: str) -> tuple[str, bool]:
    """
    Scrub sensitive PII, credentials, tokens, and financial data from strings.
    Returns (scrubbed_text, was_redacted).
    """
    if not text or not isinstance(text, str):
        return text, False

    scrubbed = text
    was_redacted = False

    for pattern, replacement in PII_PATTERNS:
        new_text, count = re.subn(pattern, replacement, scrubbed)
        if count > 0:
            scrubbed = new_text
            was_redacted = True

    return scrubbed, was_redacted
