import {
  CandidateProfile,
  CandidateProfileSchema,
  Experience,
  Education,
  Project,
  Certification,
} from '../../core/schema';

// Helper to generate unique IDs
function uid(prefix = 'item'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

export class ResumeExtractor {
  static extractFromText(
    text: string,
    profileName: string = 'Imported Resume',
    category: string = 'General'
  ): CandidateProfile {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const email = this.extractEmail(text) || '';
    const phone = this.extractPhone(text) || '';
    const links = this.extractLinks(text);
    const fullName = this.extractFullName(lines, email);
    const sections = this.segmentSections(lines);

    const skills = this.parseSkills(sections.skills || '');
    const experience = this.parseExperience(sections.experience || '');
    const education = this.parseEducation(sections.education || '');
    const projects = this.parseProjects(sections.projects || '');
    const certifications = this.parseCertifications(sections.certifications || '');
    const summary = sections.summary?.trim() || '';

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    const now = new Date().toISOString();

    const profileData = {
      id: uid('prof'),
      name: profileName,
      category,
      isDefault: false,
      createdAt: now,
      updatedAt: now,
      personal: {
        fullName: fullName || 'Candidate Name',
        firstName,
        lastName,
        email: email || 'candidate@example.com',
        phone,
        location: this.extractLocation(text) || '',
        website: links.website || '',
        linkedin: links.linkedin || '',
        github: links.github || '',
        customLinks: links.custom,
      },
      summary,
      skills,
      experience,
      education,
      projects,
      certifications,
      languages: [],
      customFields: {},
    };

    return CandidateProfileSchema.parse(profileData);
  }

  static extractEmail(text: string): string | null {
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
    const match = text.match(emailRegex);
    return match ? match[1].toLowerCase() : null;
  }

  static extractPhone(text: string): string | null {
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const match = text.match(phoneRegex);
    return match ? match[0].trim() : null;
  }

  static extractLinks(text: string): {
    linkedin?: string;
    github?: string;
    website?: string;
    custom: Record<string, string>;
  } {
    const result: { linkedin?: string; github?: string; website?: string; custom: Record<string, string> } = {
      custom: {},
    };

    const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i;
    const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i;
    const genericUrlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;

    const liMatch = text.match(linkedinRegex);
    if (liMatch) result.linkedin = liMatch[0].startsWith('http') ? liMatch[0] : `https://${liMatch[0]}`;

    const ghMatch = text.match(githubRegex);
    if (ghMatch) result.github = ghMatch[0].startsWith('http') ? ghMatch[0] : `https://${ghMatch[0]}`;

    const allUrls = text.match(genericUrlRegex) || [];
    for (const url of allUrls) {
      if (!url.includes('linkedin.com') && !url.includes('github.com')) {
        if (!result.website) {
          result.website = url;
        } else {
          result.custom[`link_${Object.keys(result.custom).length + 1}`] = url;
        }
      }
    }

    return result;
  }

  static extractFullName(lines: string[], email: string): string {
    // Usually the name is in the first 3 lines
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      const line = lines[i].trim();
      // Skip if contains email, phone, url, or section keywords
      if (
        line.includes('@') ||
        line.match(/\d{3}/) ||
        line.toLowerCase().includes('resume') ||
        line.toLowerCase().includes('curriculum') ||
        line.toLowerCase().includes('page') ||
        line.length > 50
      ) {
        continue;
      }
      // Looks like a name: 2 to 4 capitalized words
      const words = line.split(/\s+/);
      if (words.length >= 2 && words.length <= 4 && words.every((w) => /^[A-Z][a-zA-Z'.-]*$/.test(w))) {
        return line;
      }
    }

    // Fallback: derive from email username
    if (email) {
      const username = email.split('@')[0];
      const parts = username.split(/[._-]/).filter((p) => p.length > 1);
      if (parts.length >= 2) {
        return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      }
    }

    return 'Candidate';
  }

  static extractLocation(text: string): string | null {
    // Matches patterns like "San Francisco, CA" or "New York, NY 10001" or "London, UK"
    const locRegex = /([A-Z][a-zA-Z\s.-]+,\s*[A-Z]{2}(?:\s*\d{5})?)/;
    const match = text.match(locRegex);
    return match ? match[1].trim() : null;
  }

  static segmentSections(lines: string[]): Record<string, string> {
    const sections: Record<string, string[]> = {
      header: [],
      summary: [],
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
    };

    let currentSection = 'header';

    const headerMatchers: Record<string, RegExp> = {
      summary: /^(summary|professional summary|about me|profile|objective)/i,
      experience: /^(experience|work experience|employment history|professional experience|work history)/i,
      education: /^(education|academic background|degrees|academic history)/i,
      skills: /^(skills|technical skills|skills & technologies|core competencies|technologies)/i,
      projects: /^(projects|personal projects|key projects|academic projects)/i,
      certifications: /^(certifications|licenses|credentials|courses)/i,
    };

    for (const line of lines) {
      let matched = false;
      for (const [secKey, regex] of Object.entries(headerMatchers)) {
        if (regex.test(line) && line.split(/\s+/).length <= 4) {
          currentSection = secKey;
          matched = true;
          break;
        }
      }

      if (!matched) {
        if (!sections[currentSection]) sections[currentSection] = [];
        sections[currentSection].push(line);
      }
    }

    const result: Record<string, string> = {};
    for (const [key, val] of Object.entries(sections)) {
      result[key] = val.join('\n');
    }
    return result;
  }

  static parseSkills(raw: string): string[] {
    if (!raw.trim()) return [];
    // Split by comma, bullet, pipe, or newline
    const items = raw
      .split(/[,•|·\n\t]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && s.length < 40 && !s.toLowerCase().includes('skills'));

    // Deduplicate
    return Array.from(new Set(items));
  }

  static parseExperience(raw: string): Experience[] {
    if (!raw.trim()) return [];
    const lines = raw.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const experiences: Experience[] = [];

    let currentExp: Partial<Experience> | null = null;
    const dateRangeRegex = /(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*)?(\d{4})\s*[-–—to]+\s*(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*)?(\d{4}|present|current)/i;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const dateMatch = line.match(dateRangeRegex);

      if (dateMatch) {
        if (currentExp && currentExp.company) {
          experiences.push({
            id: uid('exp'),
            company: currentExp.company,
            title: currentExp.title || 'Software Engineer',
            location: currentExp.location || '',
            startDate: currentExp.startDate || '',
            endDate: currentExp.endDate || '',
            current: currentExp.current || false,
            description: currentExp.description || '',
            highlights: currentExp.highlights || [],
            skills: [],
          });
        }

        const dateStr = dateMatch[0];
        const isCurrent = /present|current/i.test(dateStr);
        let company = '';
        let title = '';

        // Check if previous line had Company | Title
        const prevLine = i > 0 ? lines[i - 1] : '';
        if (prevLine && !prevLine.match(/^[•\-*]/)) {
          if (prevLine.includes('|')) {
            const parts = prevLine.split('|').map((s) => s.trim());
            company = parts[0];
            title = parts[1] || '';
          } else if (prevLine.includes(' - ')) {
            const parts = prevLine.split(' - ').map((s) => s.trim());
            company = parts[0];
            title = parts[1] || '';
          } else {
            company = prevLine;
          }
        }

        // If company is still empty, look on current line
        if (!company) {
          const nonDatePart = line.replace(dateMatch[0], '').replace(/[|•–—,-]/g, ' ').trim();
          company = nonDatePart || 'Company';
        }

        currentExp = {
          company,
          title: title || 'Software Engineer',
          startDate: dateMatch[2] || '',
          endDate: dateMatch[4] || (isCurrent ? 'Present' : ''),
          current: isCurrent,
          highlights: [],
        };
      } else if (currentExp) {
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          currentExp.highlights = currentExp.highlights || [];
          currentExp.highlights.push(line.replace(/^[•\-*]\s*/, ''));
        } else if (!currentExp.title || currentExp.title === 'Software Engineer') {
          currentExp.title = line;
        } else {
          currentExp.description = currentExp.description ? `${currentExp.description} ${line}` : line;
        }
      }
    }

    if (currentExp && currentExp.company) {
      experiences.push({
        id: uid('exp'),
        company: currentExp.company,
        title: currentExp.title || 'Role',
        location: currentExp.location || '',
        startDate: currentExp.startDate || '',
        endDate: currentExp.endDate || '',
        current: currentExp.current || false,
        description: currentExp.description || '',
        highlights: currentExp.highlights || [],
        skills: [],
      });
    }

    return experiences;
  }

  static parseEducation(raw: string): Education[] {
    if (!raw.trim()) return [];
    const lines = raw.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const educations: Education[] = [];

    const degreeKeywords = /bachelor|master|b\.s|m\.s|b\.a|m\.a|ph\.d|doctorate|associate|b\.tech|m\.tech/i;
    const yearRegex = /\b(19\d{2}|20\d{2})\b/g;

    let currentEdu: Partial<Education> | null = null;

    for (const line of lines) {
      const isDegree = degreeKeywords.test(line);
      const isInst = line.toLowerCase().includes('university') || line.toLowerCase().includes('college') || line.toLowerCase().includes('institute') || line.toLowerCase().includes('school');
      const years = line.match(yearRegex);

      if (isInst) {
        if (currentEdu && currentEdu.institution) {
          educations.push({
            id: uid('edu'),
            institution: currentEdu.institution,
            degree: currentEdu.degree || '',
            fieldOfStudy: currentEdu.fieldOfStudy || '',
            startDate: currentEdu.startDate || '',
            endDate: currentEdu.endDate || '',
            gpa: currentEdu.gpa || '',
            highlights: currentEdu.highlights || [],
          });
        }

        currentEdu = {
          institution: line,
          degree: '',
          fieldOfStudy: '',
          startDate: years && years[0] ? years[0] : '',
          endDate: years && years[1] ? years[1] : (years && years[0] ? years[0] : ''),
          highlights: [],
        };
      } else if (currentEdu) {
        if (line.toLowerCase().includes('gpa')) {
          const gpaMatch = line.match(/\d\.\d{1,2}(?:\s*\/\s*4(?:\.0)?)?/);
          if (gpaMatch) currentEdu.gpa = gpaMatch[0];
        }

        if (isDegree) {
          currentEdu.degree = line;
        } else if (!currentEdu.fieldOfStudy && !line.toLowerCase().includes('gpa')) {
          currentEdu.fieldOfStudy = line;
        }

        if (years) {
          if (!currentEdu.startDate && years[0]) currentEdu.startDate = years[0];
          if (years[1]) currentEdu.endDate = years[1];
          else if (years[0] && !currentEdu.endDate) currentEdu.endDate = years[0];
        }
      }
    }

    if (currentEdu && currentEdu.institution) {
      educations.push({
        id: uid('edu'),
        institution: currentEdu.institution,
        degree: currentEdu.degree || '',
        fieldOfStudy: currentEdu.fieldOfStudy || '',
        startDate: currentEdu.startDate || '',
        endDate: currentEdu.endDate || '',
        gpa: currentEdu.gpa || '',
        highlights: currentEdu.highlights || [],
      });
    }

    return educations;
  }

  static parseProjects(raw: string): Project[] {
    if (!raw.trim()) return [];
    const lines = raw.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const projects: Project[] = [];
    let currentProj: Partial<Project> | null = null;

    for (const line of lines) {
      if (line.startsWith('•') || line.startsWith('-')) {
        if (currentProj) {
          currentProj.highlights = currentProj.highlights || [];
          currentProj.highlights.push(line.replace(/^[•\-]\s*/, ''));
        }
      } else {
        if (currentProj && currentProj.name) {
          projects.push({
            id: uid('proj'),
            name: currentProj.name,
            description: currentProj.description || '',
            role: currentProj.role || '',
            url: currentProj.url || '',
            repoUrl: currentProj.repoUrl || '',
            skills: [],
            highlights: currentProj.highlights || [],
          });
        }
        currentProj = {
          name: line,
          highlights: [],
        };
      }
    }

    if (currentProj && currentProj.name) {
      projects.push({
        id: uid('proj'),
        name: currentProj.name,
        description: currentProj.description || '',
        role: currentProj.role || '',
        url: currentProj.url || '',
        repoUrl: currentProj.repoUrl || '',
        skills: [],
        highlights: currentProj.highlights || [],
      });
    }

    return projects;
  }

  static parseCertifications(raw: string): Certification[] {
    if (!raw.trim()) return [];
    const lines = raw.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    return lines.map((line) => ({
      id: uid('cert'),
      name: line.replace(/^[•\-*]\s*/, ''),
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      url: '',
    }));
  }
}
