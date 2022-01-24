
module.exports = async ({github, context, owner, repo, userFile, yaml}) => {
        
    console.log(`repo = ${repo}`)
    try {
        const yml = await github.rest.repos.getContent({
            owner: owner,
            repo: repo,
            path: userFile
        })
        console.log(`repo = ${repo}`)
        const parsed = yaml.parse(yml)
        console.log(`yml result = ${parsed}`)
        console.log(`end`)

        for (const element of parsed.users) {
            console.log(`Found user: [${element}]`)
        }  
    
    } catch (error) {
        console.log(`No ${userFile} file found in repository: ${repo}: ${error}`)
    }
}