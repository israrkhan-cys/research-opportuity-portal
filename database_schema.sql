CREATE TABLE research_opportunities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    research_title VARCHAR(255) NOT NULL,
    research_description TEXT,
    research_area VARCHAR(255),
    faculty_name VARCHAR(255),
    department VARCHAR(255),
    required_skills VARCHAR(255),
    available_positions INT,
    application_deadline DATE,
    status ENUM('Open', 'Closed') DEFAULT 'Open'
);