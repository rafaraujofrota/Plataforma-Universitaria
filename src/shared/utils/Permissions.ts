// Permissões Remove serão usadas por moderadores futuramente
// A permissão ALL será dada somente ao admin
// Futuramente adicionar rotas para o admin poder alterar as permissões de qualquer usuário

export enum PERMISSIONS {
    ALL = "all",
    POST_REMOVE = "post:remove",
    EVENT_CREATE = "event:create",
    EVENT_UPDATE = "event:update",
    EVENT_REMOVE = "event:remove",
    ANNOUNCEMENT_CREATE = "announcement:create",
    ANNOUNCEMENT_UPDATE = "announcement:update",
    ANNOUNCEMENT_REMOVE = "announcement:remove",
}