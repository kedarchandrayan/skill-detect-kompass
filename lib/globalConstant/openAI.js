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
      Parse the provided resume for the specified candidate's information like name, email, phone number, total work experience and CGPA.
      If required skills are specified, for each skill evaluate if the candidate has experience with it.
      If min CGPA requirement is specified, evaluate if the candidate meets it.
      If work experience requirement is specified, evaluate if the candidate meets it.
      If custom requirements specified, then also return concise info on positive and negative matches specifying that the candidate meets those ot not respectively.
      
      Output JSON:
      {
        "name": "{{parsed name}}",
        "email": "{{parsed email}}",
        "phone_number": "{{parsed phone number}}",
        "work_experience": "{{calculated total work experience}}",
        "work_ex_match": "{{YES / NO specifying if the candidate meets the work ex requirement. NA if requirement not specified.}}",
        "cgpa": "{{CGPA of the candidate on a scale of 10}}",
        "min_cgpa_match": "{{YES / NO specifying if the candidate meets the min CGPA requirement. NA if requirement not specified.}}",
        "skills": [
          {
            "skill": "{{skill from the skills array passed in requirements. Keep the same order as passed skills requirements. If skill requirements not passed, then return empty array for skill_match}}",
            "match": "YES / NO"
          }
        ],
        "custom_requirements": "{{List down observations about the candidate for custom requirements. Be concise.}}"
      }

      Requirements:{{${oThis.selectionCriteriaPlaceholder}}}

      Resume:
      {{${oThis.resumeDetailsPlaceholder}}}
    `;
  }
}

module.exports = new OpenAI();
