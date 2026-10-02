/**
 * External video handling — YouTube / Vimeo / direct file URLs.
 * Nothing is ever downloaded; external links become embedded players on demand.
 */

export function classifyVideoUrl(url) {
  if (!url) return null
  const u = url.toLowerCase()
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube'
  if (u.includes('vimeo.com')) return 'vimeo'
  return 'file'
}

export function youtubeId(url) {
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?[^#]*v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{6,})/i)
  return m ? m[1] : null
}

export function vimeoId(url) {
  const m = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  return m ? m[1] : null
}

export function toEmbedUrl(url, { autoplay = false } = {}) {
  const kind = classifyVideoUrl(url)
  if (kind === 'youtube') {
    const id = youtubeId(url)
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}` : null
  }
  if (kind === 'vimeo') {
    const id = vimeoId(url)
    return id ? `https://player.vimeo.com/video/${id}?dnt=1${autoplay ? '&autoplay=1' : ''}` : null
  }
  return url
}

/**
 * Accepts ["url"], [{type,url}], or a mix of strings and objects and returns a
 * normalized array of {type, url, label}.
 */
export function normalizeExternalVideos(list) {
  if (!Array.isArray(list)) return []
  return list
    .map((item) => {
      if (typeof item === 'string') item = { url: item }
      if (!item?.url) return null
      const type = item.type || classifyVideoUrl(item.url)
      const label = item.label || (type === 'youtube' ? 'YouTube' : type === 'vimeo' ? 'Vimeo' : 'Video')
      return { type, url: item.url, label }
    })
    .filter(Boolean)
}
