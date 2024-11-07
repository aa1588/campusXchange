export interface DecodedToken {
    iss: string
    sub: string
    name: string
    iat: number
    exp: number
    userId: number
    scope: string[]
}
