
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
    console.log(`Found ${parsed.users.length} users`)
    for (let num = 0; num < parsed.users.length; num++) {
        const element  = parsed.users[num]
        console.log(`Found user: [${element}]`)

        // handle the user
        await handleUser(element, owner)
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

    addUserToOrganization(user, organization)
    
}

function addUserToOrganization(user, organization) {

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

    // todo: test for open invites before sending new ones
        
    // POST /orgs/{org}/invitations
    const url = `POST /orgs/${organization}/invitations`

    try {
        const inviteResult = (await github.request(url, {
            invitee_id:user.id
        })).data

        console.log(`Invite result: [${JSON.stringify(inviteResult)}]`)
    } catch (error) {
        console.log(`Error sending invite for userId ${user.id}: ${error}`)
    }
}
  
  // normal file flow
  return await run()
}