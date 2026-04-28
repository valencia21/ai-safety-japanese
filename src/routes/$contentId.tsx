import { createFileRoute } from '@tanstack/react-router'
import ContentPage from '~/pages/content-page/content-page'

export const Route = createFileRoute('/$contentId')({
  component: ContentPage,
})
