'use client'

import { useLocale } from '@/lib/i18n'
import { OBJ_CASE } from '@/lib/content/cases/objetivos/objetivos-case'
import { IdeaFork } from './idea-fork'

/** 03 · La idea: la pregunta que se abre en cuatro principios y se vuelve a juntar. */
export function ObjetivosIdea() {
  const { t } = useLocale()
  return <IdeaFork question={t(OBJ_CASE.idea.hmw)} />
}
