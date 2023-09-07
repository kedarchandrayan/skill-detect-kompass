class OpenAI {
  get selectionCriteriaPlaceholder() {
    return 'selection_criteria';
  }

  get resumeDetailsPlaceholder() {
    return 'resume_details';
  }

  get promptWithPlaceHolder() {
    const oThis = this;

    return `
      Parse resume for concise highlights matching selection criteria, provide a confidence score (0-100), and retrieve name/contact info.
      
      Output JSON:
      {
        "name": "{{parsed name}}",
        "email": "{{parsed email}}",
        "phone_number": "{{parsed phone number}}",
        "match_confidence_score": {{confidence score out of 100}},
        "total_work_experience": "{{calculated total work experience}}",
        "criteria": [
          {
            "criterion_name": "{{criterion description}}",
            "is_matched": "{{true/false boolean based on match. When no information is specified in the resume, return false for is_matched}}",
            "criterion_summary": "{{reason for match/no-match having the mention of the criterion too. Be concise.}}"
          }
        ]
      }

      Selection criteria:
      {{${oThis.selectionCriteriaPlaceholder}}}

      Resume:
      {{${oThis.resumeDetailsPlaceholder}}}
    `;
  }
}

module.exports = new OpenAI();
