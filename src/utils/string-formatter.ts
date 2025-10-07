export const getInitials = (value: string) => {
    return value.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}