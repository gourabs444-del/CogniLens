const mappingIndex = {
  mbti_q_1: {
    A: { Ni: 2, Fi: 2 },
    B: { Ti: 3, logicalDetachment: 2 },
    C: { Si: 2, Fe: 1 },
    D: { Te: 3, controlNeed: 2 }
  },
  mbti_q_2: {
    A: { Ni: 3, abstraction: 2, existentialThinking: 3 },
    B: { Te: 2, controlNeed: 4, dominance: 1 },
    C: { Fi: 3, attachmentNeed: 2, emotionalDepth: 2 },
    D: { Ne: 3, noveltySeeking: 3 }
  },
  mbti_q_3: {
    A: { Ti: 3, logicalDetachment: 2 },
    B: { Ni: 2, Fi: 2, socialSensitivity: 1 },
    C: { Ni: 3, strategicThinking: 2, darkCuriosity: 1 },
    D: { Te: 3, growthOrientation: 2 }
  },
  mbti_q_4: {
    A: { autonomy: 4, controlResistance: 3, Te: 1 },
    B: { Ne: 3, Ti: 2, abstraction: 2 },
    C: { Fi: 4, identityProtection: 3 },
    D: { Ne: 3, Se: 2, noveltySeeking: 3 }
  },
  mbti_q_5: {
    A: { Ti: 2, Ni: 2, abstraction: 2 },
    B: { Te: 4, strategicThinking: 2 },
    C: { Fe: 3, empathy: 2 },
    D: { Ne: 4, noveltySeeking: 2 }
  },
  mbti_q_6: {
    A: { Te: 3, efficiencyBias: 2, logicalDetachment: 1 },
    B: { responsibility: 3, Si: 1, controlNeed: 1 },
    C: { Fe: 3, empathy: 2 },
    D: { Ni: 2, Te: 2, systemsThinking: 3 }
  },
  mbti_q_7: {
    A: { Ti: 2, logicalDetachment: 3 },
    B: { Te: 2, competenceRespect: 3 },
    C: { Fi: 2, trustSensitivity: 3 },
    D: { Ne: 2, autonomy: 2 }
  },
  mbti_q_8: {
    A: { emotionalMaturity: 2, Te: 1 },
    B: { Ti: 3, Ni: 2 },
    C: { egoDefense: 4, socialMasking: 2 },
    D: { Ne: 3, adaptability: 3 }
  },
  mbti_q_9: {
    A: { Ti: 2, validationNeed: 2 },
    B: { Si: 2, responsibility: 3 },
    C: { Fi: 3, identityNeed: 2 },
    D: { Fe: 3, empathy: 2 }
  },
  mbti_q_10: {
    A: { ambition: 3, validationNeed: 2 },
    B: { Te: 2, controlNeed: 4 },
    C: { emotionalGuardedness: 4, socialMasking: 2 },
    D: { Ni: 3, existentialThinking: 2 }
  },
  mbti_q_11: {
    A: { Te: 2, Ni: 2, utilitarianism: 4, logicalDetachment: 2 },
    B: { Fi: 3, Fe: 2, harmAvoidance: 3 }
  },
  mbti_q_12: {
    A: { Ni: 4 },
    B: { Ne: 3, Se: 1 },
    C: { Ti: 2, Fe: 2 },
    D: { Te: 4 }
  },
  mbti_q_18: {
    A: { Se: 4 },
    B: { Ni: 3 },
    C: { Fe: 3 },
    D: { Ni: 2, Te: 1 }
  },
  mbti_q_19: {
    A: { Si: 4 },
    B: { Ne: 3 },
    C: { Ti: 2, Ni: 2 },
    D: { Se: 3 }
  },
  mbti_q_13: {
    A: { Te: 2, utilitarianism: 3 },
    B: { Fe: 3, collectiveEmpathy: 3 },
    C: { Ni: 3, Ti: 2 },
    D: { internalConflict: 3 }
  },
  mbti_q_14: {
    A: { controlNeed: 3, utilitarianism: 3 },
    B: { Fi: 2, autonomy: 2 },
    C: { Ni: 2, Te: 2, systemsThinking: 2 },
    D: { strategicThinking: 3, trustSensitivity: 2 }
  },
  mbti_q_15: {
    A: { Si: 2, ruleOrientation: 3 },
    B: { attachmentNeed: 3, loyaltyBias: 3 },
    C: { Fe: 2, emotionalBalance: 2 },
    D: { avoidance: 3 }
  },
  mbti_q_16: {
    A: { Fi: 3, harmAvoidance: 2 },
    B: { Te: 2, utilitarianism: 3 },
    C: { Ni: 3, strategicThinking: 3 },
    D: { internalConflict: 2 }
  },
  mbti_q_17: {
    A: { emotionalEscape: 3 },
    B: { Fi: 2, identityProtection: 3 },
    C: { Ni: 2, adaptiveCoping: 2 },
    D: { Ti: 2, contextDependence: 2 }
  },

  eq_q_1: {
    A: { charmSkepticism: 3, manipulationSensitivity: 2, socialMasking: 1 },
    B: { logicalThreatSensitivity: 3, empathy: 1, emotionalGuardedness: 1 },
    C: { emotionalControl: 2, emotionalReactivity: -2, boundaryStrength: 1 },
    D: { ambiguitySensitivity: 3, closureSeeking: 2, distrust: 1, darkCuriosity: 1 }
  },
  eq_q_2: {
    A: { darkCuriosity: 2, emotionalIntensity: 2, emotionalReactivity: 1, attachment: 1 },
    B: { emotionalGuardedness: 2, rumination: 1, selfPreservation: 1 },
    C: { warmthSeeking: 3, emotionalControl: 1, optimism: 1 },
    D: { ambiguitySensitivity: 2, closureSeeking: 1, darkCuriosity: 1 }
  },
  eq_q_3: {
    A: { validationSeeking: 2, validationNeed: 1, socialMasking: 2, vulnerabilityTolerance: -1 },
    B: { attachment: 3, attachmentNeed: 1, validationSeeking: 1, emptinessSensitivity: 1 },
    C: { autonomyNeed: 2, autonomy: 1, controlNeed: 2, boundaryStrength: 2 },
    D: { authenticity: 2, closureSeeking: 2, misunderstoodSensitivity: 2 }
  },
  eq_q_4: {
    A: { rumination: 3, socialMasking: 1, validationSeeking: 1 },
    B: { attachment: 2, attachmentNeed: 1, empathy: 1, rumination: 1, emotionalDepth: 1 },
    C: { closureSeeking: 1, obsession: 1, stagnationFear: 1 },
    D: { closureSeeking: 3, Ti: 1, rumination: 2, abstraction: 1 }
  },
  eq_q_5: {
    A: { authenticity: 2, socialAdaptability: -1, boundaryStrength: 1 },
    B: { dependenceAversion: 3, boundaryStrength: 2, attachment: -1 },
    C: { emotionalControl: 2, selfPreservation: 1, uncertaintyTolerance: -1 },
    D: { meaningNeed: 3, existentialSensitivity: 2, stagnationFear: 1, emotionalDepth: 1 }
  },
  eq_q_6: {
    A: { validationSeeking: 2, validationNeed: 1, selfPreservation: 1, competenceWound: 2 },
    B: { authenticity: 3, socialMasking: 2, truthCourage: 1 },
    C: { attachment: 2, attachmentNeed: 2, validationSeeking: 2, uniquenessNeed: 1 },
    D: { attachment: 2, attachmentNeed: 1, emptinessSensitivity: 2, validationSeeking: 2 }
  },
  eq_q_7: {
    A: { dependenceAversion: 3, boundaryStrength: 2, attachment: -1 },
    B: { intelligenceIdentity: 3, Ti: 1, validationSeeking: 1 },
    C: { controlNeed: 3, emotionalControl: 2, selfPreservation: 1 },
    D: { validationSeeking: -2, validationNeed: -1, autonomyNeed: 1, egoControl: 2 }
  },
  eq_q_8: {
    A: { validationSeeking: 1, validationNeed: 1, intelligenceIdentity: 2, dominance: 1 },
    B: { Ti: 2, socialAdaptability: -1, empathy: -1, logicalDetachment: 1 },
    C: { distrust: 2, selfPreservation: 2, motiveScanning: 1 },
    D: { empathy: 2, responsibility: 3, consequentialThinking: 1 }
  },
  eq_q_9: {
    A: { boundaryStrength: 3, detachment: 3, attachment: -2 },
    B: { compassion: 2, trustRepair: 3, attachment: 1 },
    C: { emotionalControl: 2, boundaryStrength: 2, detachment: 1 },
    D: { distrust: 2, testingBehavior: 3, closureSeeking: 1, strategicThinking: 1 }
  },
  eq_q_10: {
    A: { solitudeComfort: 3, detachment: 1, attachment: -1 },
    B: { attachment: 3, attachmentNeed: 2, emptinessSensitivity: 3, validationSeeking: 1 },
    C: { curiosity: 3, emotionalControl: 1, darkCuriosity: 1 },
    D: { autonomyNeed: 2, autonomy: 1, boundaryStrength: 2, solitudeComfort: 1 }
  },
  eq_q_11: {
    A: { empathy: 2, compassion: 1, attachment: 1 },
    B: { consequentialThinking: 1, utilitarianThinking: 1, empathy: -1 }
  },
  eq_q_12: {
    A: { consequentialThinking: 3, utilitarianThinking: 2, logic: 1 },
    B: { empathy: 2, compassion: 2, utilitarianThinking: -1 }
  },
  eq_q_13: {
    A: { empathy: 3, compassion: 1, attachment: 1 },
    B: { consequentialThinking: 2, utilitarianThinking: 2, logic: 1 }
  },
  eq_q_14: {
    A: { compassion: 3, empathy: 1, justice: -1 },
    B: { justice: 3, boundaryStrength: 1, compassion: -1 }
  },
  eq_q_15: {
    A: { honesty: 3, guiltSensitivity: 2, truthCourage: 1 },
    B: { selfPreservation: 2, attachment: 1, honesty: -1 }
  },
  eq_q_16: {
    A: { truthCourage: 3, honesty: 2, compassion: -1 },
    B: { compassion: 2, consequentialThinking: 2, honesty: -1 }
  },
  eq_q_17: {
    A: { sacrifice: 3, compassion: 2, selfPreservation: -1 },
    B: { selfPreservation: 3, boundaryStrength: 2, sacrifice: -1 }
  }
};

export const mappings = Object.freeze(
  Object.entries(mappingIndex).map(([questionId, mappings]) => ({
    questionId,
    mappings: Object.freeze({ ...mappings })
  }))
);

export const mappingsByQuestionId = Object.freeze(mappingIndex);

export function getMapping(questionId, optionKey) {
  return mappingsByQuestionId[questionId]?.[optionKey] || {};
}

if (typeof window !== "undefined") {
  window.CogniLensData = {
    ...(window.CogniLensData || {}),
    mappings,
    mappingsByQuestionId,
    mappingIndex
  };
}
