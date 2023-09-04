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
            "is_matched": "{{true/false based on match}}",
            "criterion_summary": "{{summary of match/no-match}}"
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
