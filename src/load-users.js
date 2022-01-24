
module.exports = async ({github, context, owner, repo, userFile, yaml}) => {
        
    console.log(`repo = ${repo}`)
    try {
        const yml = await github.rest.repos.getContent({
            owner: owner,
            repo: repo,
            path: userFile
        })

        const {data: content} = await github.request({url: yml.data.download_url})
        const parsed = yaml.parse(content)

        console.log(`yml result = ${parsed}`)
        console.log(`users = ${parsed.users}`)
        console.log(`len = ${parsed.users.length}`)

        for (let num = 0; num < parsed.users.length; num++) {
            const element  = parsed.users[num]
            console.log(`Found user: [${element}]`)
        }  
    
    } catch (error) {
        console.log(`error: ${error}`)
        throw error
    }

    return 1
}