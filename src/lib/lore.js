/**
 * Conteúdo de Lore e Manual - Solo Leveling
 * @module data/solo-leveling/lore
 */
import { manualSections } from "../manualSections";

export const LORE_SECTIONS = manualSections.map((section) => ({
	id: section.id,
	title: section.title,
	content: section.content,
	contentHtml: section.content,
}));
