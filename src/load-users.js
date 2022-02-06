module.exports = async ({github, context, owner, repo, userFile, yaml}) => {
        
    async function run() { 
        console.log(`repo = ${repo}, owner = ${owner}, $userFile = ${userFile}`)
        // todo: check if the token we are using has the correct access scopes
        let content
        try {
            const yml = await github.rest.repos.getContent({
                owner: owner,
                repo: repo,
                path: userFile
            })

            const result = await github.request({url: yml.data.download_url})
            content = result.data
        
        } catch (error) {
            console.log(`error loading the ${userFile} file: ${error}`)
            throw error
        }

        const parsed = yaml.parse(content)
        console.log(`Found ${parsed.teams.length} teams`)        
        for (let num = 0; num < parsed.teams.length; num++) {
            const team  = parsed.teams[num]
            console.log(`Handling team [${team}]`)
            for (let num = 0; num < team.users.length; num++) {
                const element  = parsed.users[num]
                console.log(`Found user: [${element}]`)

                // handle the user
                await handleUser(element, owner)
            }  
        }

        return 1
    }

    async function handleUser (userHandle, organization){
        console.log(`Handling user [${userHandle}] for organization [${organization}]`)
        // test if it actually is a proper user handle
        const userUrl = `https://api.github.com/users/${userHandle}`
        let user
        try {
        user = (await github.request({url: userUrl})).data 
        console.log(`Handle exists`)
        //console.log(JSON.stringify(user))
        } catch (error) {
        console.log(`Error retrieving user with handle [${userHandle}]: ${error}`)
        }   

        if (!user) {
            return
        }

        await addUserToOrganization(user, organization)

        const repoName = `attendee-${user.login}`
        await createUserRepos(user, organization, repoName)
        await addUserToRepo(user, organization, repoName)
    }

    async function addUserToOrganization(user, organization) {

        // find if user is already member on this org
        const membersUrl = `https://api.github.com/orgs/${organization}/members/${user.login}`
        let userMember
        let isFound
        try {
            console.log(`membersUrl: [${membersUrl}]`)
            userMember = (await github.request({url: membersUrl}))
            isFound = userMember.status == 204
        } catch (error) {
        //console.log(`Error retrieving user membership with handle [${user.login}] in org [${organization}]: ${error}`)
        isFound = false
        }
        
        if (isFound) {
            console.log(`User ${user.login} already is a member on this organization ${organization}`)
            return
        }

        console.log(`Adding the user ${user.id} to the organization ${organization}`)

        // todo: test for open invites before sending new ones?
        // creating a new invite doesn't fail if there already is an open invite, so skipping for now

        try {
            const url = `POST /orgs/${organization}/invitations`
            await github.request(url, {
                invitee_id:user.id
            })
            console.log(`Invite send`)
        } catch (error) {
            console.log(`Error sending invite for userId ${user.id}: ${error}`)
        }
    }

    async function createUserRepos(user, organization, repoName) {

        try {
            const {data: userRepo} = await github.rest.repos.get({
                owner: organization,
                repo: repoName,
            });

            if (userRepo) {
                console.log(`Repo [${repoName}] already exists`)
                return
            }            
        } catch (error) {
            console.log(`get repo error: [${error}]`)
        }

        try {
            await github.rest.repos.createInOrg({
                org: organization,
                name: repoName,
                private: true,
            });

            console.log(`Created repository with name [${repoName}] in org [${organization}]`)
        } catch (error) {
            console.log(`Error creating the [${repoName}] in org [${organization}]: ${error}`)
        }
    } 

    async function addUserToRepo(user, organization, repoName) {

        console.log(`Adding user to the repo`)
        try {
            github.rest.repos.addCollaborator({
                owner: organization,
                repo: repoName,
                username: user.login,
                permission: "admin"
            });
            console.log(`User added to the repo`)
        } catch (error) {
            console.log(`Error adding user [${user.login}] to repo [${repoName}]: ${error}`)
        }
    }


  // normal file flow
  return run()
}