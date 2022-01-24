
module.exports = async ({github, context, owner, repo, userFile, yaml}) => {
        
    console.log(`repo = ${repo}`)
    try {
        const yml = await github.rest.repos.getContent({
            owner: owner,
            repo: repo,
            path: userFile
        })
        console.log(`repo = ${yml.data}`)
        const parsed = yaml.parse(yml.data)
        // console.log(`yml result = ${parsed}`)
        // console.log(`users = ${parsed.users}`)
        // console.log(`len = ${parsed.users.length}`)
        // console.log(`end`)

        // for (let num = 0; num < parsed.users; num++) {
        //     const element  = parsed.users[num]
        //     console.log(`Found user: [${element}]`)
        // }  
    
    } catch (error) {
        console.log(`error: ${error}`)
        throw error
    }

    return 1
}