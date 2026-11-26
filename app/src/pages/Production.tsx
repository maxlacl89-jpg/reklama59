import { EditableBlock, LeadForm, EditableImage, PageHeader, Reveal, Star } from '@/components/site/ui'
import EditableText from '@/components/EditableText'
import { useContent } from '@/lib/content'

export default function Production() {
  const { t, set, editing, get } = useContent()
  const metalProducts = get('production.metalProducts') as string[]

  return (
    <div>
      <PageHeader kicker="Продукция" title={t('production.heading')} text={t('production.intro')} />

      {/* РИ производство */}
      <EditableBlock bid="pg-production-ri" noPad sizeControl={false} className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <EditableImage
              path="production.riImage"
              src={t('production.riImage')}
              alt={t('production.riTitle')}
              className="aspect-[4/3] rounded-3xl border border-[#E4E4E0]"
            />
          </Reveal>
          <div>
            <Reveal>
              <Star className="h-8 w-8 text-[#F44B43]" />
            </Reveal>
            <Reveal>
              <EditableText
                as="h2"
                value={t('production.riTitle')}
                onChange={(v) => set('production.riTitle', v)}
                editing={editing}
                className="font-display mt-4 text-[clamp(1.4rem,3vw,2.2rem)] font-extrabold leading-tight tracking-tight text-[#16150F]"
              />
            </Reveal>
            <Reveal>
              <EditableText
                as="p"
                value={t('production.riText')}
                onChange={(v) => set('production.riText', v)}
                editing={editing}
                multiline
                className="mt-5 whitespace-pre-wrap text-base leading-[1.8] text-[#6B675C]"
              />
            </Reveal>
          </div>
        </div>
      </EditableBlock>

      {/* Металлопрокат */}
      <EditableBlock bid="pg-production-metal" noPad sizeControl={false} className="border-t border-[#E4E4E0] bg-[#F4F4F2] py-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:px-8">
          <div className="order-2 md:order-1">
            <Reveal>
              <EditableText
                as="h2"
                value={t('production.metalTitle')}
                onChange={(v) => set('production.metalTitle', v)}
                editing={editing}
                className="font-display text-[clamp(1.4rem,3vw,2.2rem)] font-extrabold leading-tight tracking-tight text-[#16150F]"
              />
            </Reveal>
            <Reveal>
              <EditableText
                as="p"
                value={t('production.metalText')}
                onChange={(v) => set('production.metalText', v)}
                editing={editing}
                multiline
                className="mt-5 whitespace-pre-wrap text-base leading-[1.8] text-[#6B675C]"
              />
            </Reveal>
            <Reveal>
              <ul className="mt-6 grid gap-2.5">
                {metalProducts.map((m, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-semibold text-[#16150F]">
                    <span className="h-2 w-2 shrink-0 rotate-45 bg-[#1813F1]" />
                    <EditableText as="span" value={m} onChange={(v) => set(`production.metalProducts.${i}`, v)} editing={editing} />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="order-1 md:order-2">
            <EditableImage
              path="production.metalImage"
              src={t('production.metalImage')}
              alt={t('production.metalTitle')}
              className="aspect-[4/3] rounded-3xl border border-[#E4E4E0]"
            />
          </Reveal>
        </div>
      </EditableBlock>

      <LeadForm compact />
    </div>
  )
}
