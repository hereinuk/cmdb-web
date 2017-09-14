import config from '../config'

const Host = config.apiHost
const AuthHost = config.authServerHost

export default {
    getUserByToken: Host + "/api/userinfo",
    servers: Host + "/api/servers",
    currentUserServer: Host + "/api/current/servers",
    server: (serverId) => Host + "/api/server/" + serverId,
    rdss: Host + "/api/rdss",
    rds: (rdsId) => Host + "/api/rds/" + rdsId,
    projectGroups: Host + "/api/projectgroups",
    projectGroup: (groupId) => Host + "/api/projectgroup/" + groupId,
    selectProjectGroup: Host + "/api/select/projectgroups",
    projects: Host + "/api/projects",
    project: (projectId) => Host + "/api/project/" + projectId,
    syncServer: Host + "/api/sync/server",
    syncRDS: Host + "/api/sync/rds",
    syncProject: Host + "/api/sync/project",
    searchUser: AuthHost + "/api/usersearch",
    getUserById: (userId) => AuthHost + "/api/userinfo/" + userId
}
