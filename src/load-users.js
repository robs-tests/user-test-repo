
module.exports = async ({github, context, owner, repo, userFile, yaml}) => {
        
async function run() { 
    console.log(`repo = ${repo}`)
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
        await handleUser(element)
    }  

    return 1
}

async function handleUser (userHandle){
    console.log(`Handling user ${userHandle}`)
    // test if it actually is a proper user handle
    userUrl = `https://api.github.com/users/${userHandle}`
    let result
    try {
       result = await github.request({url: userUrl}) 
    } catch (error) {
      console.log(`Error retrieving user with handle ${userHandle}: ${error}`)  
    }   

    if (!result) {
        return
    }

    // todo: add PAT with access to get this info /orgs/{org}/members/{username}
    const membersUrl = `https://api.github.com/orgs/${owner}/members/${userHandle}`
    result = (await github.request({url: membersUrl})).data
    if (!result || result.length === 0) {
        console.log(`Members is empty`)
    }
    
    // find if user already is a collaborator on this repo
    console.log(`log: ${JSON.stringify(result)}`)

    return
    if (isFound) {
        console.log(`User ${userHandle} already is a collaborator on repo ${owner}/${repo}`)
    }
    else {
        console.log(`Adding user ${userHandle} to repo ${owner}/${repo}`)

    }
}
  
  console.log(`1`)
  return await run()
}