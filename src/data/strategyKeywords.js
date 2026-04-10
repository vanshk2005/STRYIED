/**
 * Professional Legal Strategy Mappings (BNS/BNSS/BSA era)
 * This file maps high-level legal maneuvers to keywords for initial filtering,
 * though the primary matching is now handled by semantic embeddings.
 */

export const strategyMappings = [
  {
    strategy: "Quashing of FIR (u/s 528 BNSS / old 482 CrPC)",
    keywords: ["quash", "false fir", "malicious", "no offense", "preliminary", "abuse of process", "high court", "quashing"],
    description: "Inherent powers of the High Court to quash an FIR to prevent abuse of process of any Court or to secure the ends of justice."
  },
  {
    strategy: "Default Bail (u/s 187 BNSS / old 167 CrPC)",
    keywords: ["default bail", "limit", "90 days", "60 days", "chargesheet delay", "statutory bail", "procedural error"],
    description: "Right to be released on bail if the investigation is not completed within the statutory period of 60 or 90 days."
  },
  {
    strategy: "Anticipatory Bail (u/s 482 BNSS / old 438 CrPC)",
    keywords: ["anticipatory bail", "pre-arrest", "protection", "fear of arrest", "interim relief", "sessions court", "high court"],
    description: "Protection from arrest in case of non-bailable offenses before the arrest has actually been made."
  },
  {
    strategy: "Challenging Admissibility of Electronic Evidence (u/s 63 BSA)",
    keywords: ["electronic", "digital", "certificate", "whatsapp", "email", "server", "metadata", "63 bsa", "65b"],
    description: "Challenging the admissibility of electronic records if not accompanied by the mandatory certificate under Section 63 of the BSA."
  },
  {
    strategy: "Section 479 BNSS (Maximum Period of Detention)",
    keywords: ["undertrial", "half period", "one-third", "detention", "maximum term", "first time offender", "jail duration"],
    description: "A person who has undergone detention for up to one-third or half of the maximum imprisonment shall be released on bail."
  },
  {
    strategy: "Habeas Corpus (Art. 226/32 Constitution)",
    keywords: ["illegal detention", "police custody", "wrongful arrest", "unlawful", "produced before magistrate", "24 hours"],
    description: "Writ to produce a person in court to check the legality of their detention or arrest."
  },
  {
    strategy: "Claim of General Exceptions (BNS Chapter III)",
    keywords: ["self-defense", "private defense", "insanity", "accident", "mistake of fact", "necessity", "infancy", "intoxication"],
    description: "Arguing that the act falls under the 'General Exceptions' provided in Sections 14 to 44 of the BNS."
  },
  {
    strategy: "Challenge to Search and Seizure (u/s 105 BNSS)",
    keywords: ["search", "seizure", "panchnama", "witnesses", "videography", "irregularity", "unauthorized", "compliance"],
    description: "Challenging the legality of the search or seizure if mandatory procedures like videography or independent witnesses were not followed."
  },
  {
    strategy: "Application for Compoundable Offense Settlement",
    keywords: ["settle", "compromise", "quash on compromise", "mutual consent", "compoundable", "victim", "agreement"],
    description: "Seeking to quash or close proceedings where the offense is legally compoundable or where a compromise has been reached."
  },
  {
    strategy: "Plea Bargaining (u/s 289-300 BNSS)",
    keywords: ["plea bargain", "lesser sentence", "admission", "mutually satisfactory", "compensation", "guilty plea"],
    description: "Negotiating for a lesser sentence in exchange for an admission of guilt in certain types of eligible offenses."
  },
  {
    strategy: "Challenge to Medical Evidence / Forensic Report",
    keywords: ["medical", "doctor", "forensic", "autopsy", "injury report", "inconsistency", "dna", "expert witness"],
    description: "Questioning the validity or consistency of medical or forensic evidence against the ocular testimony."
  },
  {
    strategy: "Quashing on Basis of Delay (Constitutional Right)",
    keywords: ["delay", "inordinate delay", "trial delay", "right to speedy trial", "fair trial", "article 21"],
    description: "Seeking quashing of proceedings based on the violation of the right to a speedy trial under Article 21."
  },
  {
    strategy: "Discharge Application (u/s 250/262/272 BNSS)",
    keywords: ["discharge", "no evidence", "baseless", "insufficient grounds", "magistrate discharge", "sessions discharge"],
    description: "Requesting the court to discharge the accused before trial because there are no sufficient grounds for proceeding."
  },
  {
    strategy: "Stay of Arrest / Protection from Coercive Steps",
    keywords: ["stay", "coercive steps", "protection", "no arrest", "interim protection", "high court stay"],
    description: "Seeking a High Court stay on the arrest or coercive actions during the pendency of a quashing or bail petition."
  },
  {
    strategy: "Transitional Law Defense (IPC vs BNS Applicability)",
    keywords: ["old law", "new law", "july 1", "retrospective", "procedural", "substantive", "ipc match"],
    description: "Challenging the applicability of BNS for acts committed before it came into force (1st July 2024)."
  }
];

export function getLegalSuggestions(text) {
  // Placeholder for backward compatibility. 
  // Real logic now happens via semantic search in the API.
  return [];
}
