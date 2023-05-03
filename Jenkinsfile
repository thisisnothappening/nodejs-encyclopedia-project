pipeline {
	agent {
		label "encyclopedia-project-agent"
	}
	triggers {
        pollSCM '* * * * *'
    }
	stages {
		stage("Build") {
			steps {
				sh "npm install"
			}
		}
		stage("Test") {
			steps {
				sh "npm test"
			}
		}
		stage("Deploy") {
			// when  {
			// 	anyOf {
      		// 		branch 'main'
      		// 		branch 'master'
   			// 	}
			// }
			steps {
				// sh "docker build -t nodejs-encyclopedia-project:alpine-cors-prod-latest ."
				// sh "docker tag nodejs-encyclopedia-project:alpine-cors-prod-latest thisisnothappening/nodejs-encyclopedia-project:alpine-cors-prod-latest"
				// sh "docker push thisisnothappening/nodejs-encyclopedia-project:alpine-cors-prod-latest"

				withCredentials([sshUserPrivateKey(credentialsId: 'amazon-linux-vm-key', keyFileVariable: 'KEYFILE')]) {
					sshagent(credentials: ['amazon-linux-vm-key']) {
                    	sh "ssh -o StrictHostKeyChecking=no -i $KEYFILE ec2-user@ec2-13-50-15-190.eu-north-1.compute.amazonaws.com; \
						sudo -s; \
						cd ~; \
						mkdir test \
						"
                	}
				}
			}
		}
	}
}