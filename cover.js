const coverLetterTemplates = {
    fullStack: `Dear Hiring Manager,

I am writing to express my strong interest in the Full Stack Development internship position at your esteemed organization. As a Computer Science undergraduate at Jain University, Bangalore, I bring a robust foundation in web development and a passion for creating innovative solutions.

Technical Expertise:
• Full Stack Development: Proficient in MERN Stack (MongoDB, Express.js, React.js, Node.js)
• Frontend: React.js, HTML5, CSS3, JavaScript (ES6+), Bootstrap, Material-UI
• Backend: Node.js, Express.js, RESTful APIs, GraphQL
• Database: MongoDB, MySQL, Redis
• Tools: Git, Docker, AWS, CI/CD

Notable Projects:
1. Modern Blogging Platform (MERN Stack)
   - Implemented real-time features using WebSocket
   - Integrated AWS S3 for media storage
   - Achieved 99.9% uptime with proper error handling

2. Recipe App (MERN Stack)
   - Developed responsive UI with Material-UI
   - Implemented JWT authentication
   - Optimized image uploads with compression

3. NotesBuddy (React.js, Node.js)
   - Built real-time collaboration features
   - Implemented rich text editing
   - Integrated cloud storage

4. SummerSafe (Full Stack)
   - Developed secure payment integration
   - Implemented real-time tracking
   - Created admin dashboard

I am particularly drawn to your organization's innovative approach and commitment to technological excellence. I am confident that my technical skills, combined with my problem-solving abilities and eagerness to learn, would make me a valuable addition to your team.

I look forward to the opportunity to discuss how I can contribute to your organization's success.

Best regards,
[Your Name]`,

    dataScience: `Dear Hiring Manager,

I am writing to express my interest in the Data Science internship position. As a Computer Science student with a strong foundation in data analysis and machine learning, I am excited about the opportunity to contribute to your data-driven initiatives.

Technical Skills:
• Programming: Python, R, SQL
• Data Analysis: Pandas, NumPy, SciPy
• Machine Learning: Scikit-learn, TensorFlow, PyTorch
• Data Visualization: Matplotlib, Seaborn, Tableau
• Big Data: Hadoop, Spark

I am eager to apply my skills in a real-world setting and contribute to your organization's data science initiatives.

Best regards,
[Your Name]`
};

const generateCoverLetter = (templateType = 'fullStack', customizations = {}) => {
    let template = coverLetterTemplates[templateType] || coverLetterTemplates.fullStack;
    
    // Apply customizations
    Object.entries(customizations).forEach(([key, value]) => {
        template = template.replace(`[${key}]`, value);
    });
    
    return template;
};

module.exports = {
    generateCoverLetter,
    coverLetterTemplates
};
