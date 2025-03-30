import LlamaAI from 'llamaai';

const apiToken = process.env.REACT_APP_LLAMA_API_KEY;
const llamaAPI = new LlamaAI(apiToken);

export default function generateCoffeeChat(alumni , userInfo, callback) {

  const apiRequestJson = {
    "model": "llama3.1-70b",
    "messages": [
      {
        "role": "user",
        "content": `
        Write a concise, semi-formal, high-quality coffee chat request email introducing myself to alumnus ${alumni.name} at ${alumni.company}, 
        in first person. Each sentence should be under 10 to 15 words. Focus on requesting a brief chat, rather than a direct job pitch. 
        Show friendly openness to learning about their experience and possible opportunities, but do not overhype or praise the alumnus extensively. 

        Relevant alumnus info: 
        - Bio: ${alumni.bio}
        - Experience: ${JSON.stringify(alumni.experience)}
        - Education: ${alumni.education.school}

        Relevant info about me (the applicant): 
        - Bio: ${userInfo.bio}
        - Name: ${userInfo.name}
        - Current School: ${userInfo.school}
        - Major: ${userInfo.major}
        - Interests: ${userInfo.interests}

        If there’s a current role at ${alumni.company} that aligns with my profile, briefly mention it; otherwise, do not. 
        Exclude any irrelevant details. Start with a brief introduction of myself.
        Keep it three paragraphs max.
        Make the subject some sort of coffee chat invitation.
        Format your response exactly as follows:

        SUBJECT: [Create a concise subject line]

        [Your email body here]
        `
      }
    ],
    // You can also include other parameters like temperature, max_tokens, etc.
    // "temperature": 0.7,
    // "max_tokens": 500
  };

  llamaAPI.run(apiRequestJson)
    .then(response => {
      console.log("Coffee Chat Response:", response);
      if (callback && typeof callback === 'function') {
        const fullContent = response.choices[0].message.content;
        // Parse out the subject and body
        const subjectMatch = fullContent.match(/SUBJECT: (.*?)(?:\n\n|\n)([\s\S]*)/);
        if (subjectMatch && subjectMatch.length >= 3) {
          const subject = subjectMatch[1].trim();
          const content = subjectMatch[2].trim();
          callback({ subject, content });
        } else {
          // Fallback in case the format doesn't match
          callback({ 
            subject: `Introduction - ${userInfo.name || 'Prospective Candidate'}`, 
            content: fullContent 
          });
        }
      }
    })
    .catch(error => {
      console.error("Error generating cold email:", error);
      if (callback && typeof callback === 'function') {
        callback({ 
          subject: "Error generating email", 
          content: "Error generating email: " + error.message 
        });
      }
    });
}