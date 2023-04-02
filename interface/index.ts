export interface User {
  id: number
  first_name: string
  last_name: string
  username: string
}


export interface Links {
  "next": string
  "previous": string
}

export interface Score {
  "created": string
  "uid": string
  "channel": string
  "score": number
  "user": User
}

export interface ResponseScores {
  "links": Links
  "count": number
  "page_size": number
  "num_pages": number
  "results": Score[]
}
