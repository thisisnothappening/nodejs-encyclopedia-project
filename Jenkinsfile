pipeline {
	agent {
		node {
			label "encyclopedia-project-agent"
		}
	}
	triggers {
		// this means once per minute. Change it later to once per 5 mins, or more
		pollSCM "* * * * *"
	}
	environment {
        DOCKER_IMAGE = 'nodejs-encyclopedia-project'
        DOCKER_REGISTRY = 'thisisnothappening'
        version = ''
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
		stage("Push Image") {
			when {
                branch 'main'
            }
			steps {
				script {
					version = sh(script: "node -p \"require('./package.json').version\"", returnStdout: true).trim()
					version = 'test'
					def exists = {
						def result = sh(script: "curl --silent -f --head -lL https://hub.docker.com/v2/repositories/${DOCKER_REGISTRY}/${DOCKER_IMAGE}/tags/${version}/", returnStatus: true)
						return result == 0
					}
					// if (exists()) {
					// 	error("An image with the tag '${version}' already exists. Please run `npm version [major/minor/patch]`, then commit and push to GitHub.")
					// }
					withCredentials([
						string(credentialsId: 'docker-login-password', variable: 'DOCKER_PASSWORD')
						]) {
						sh "docker build -t ${DOCKER_IMAGE}:latest -f Dockerfile.start ."
						sh "docker tag ${DOCKER_IMAGE}:latest ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"
						sh "docker tag ${DOCKER_IMAGE}:latest ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${version}"
						sh 'docker login --username $DOCKER_REGISTRY --password $DOCKER_PASSWORD'
						sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"
						sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${version}"
						sh "docker image prune -f"
					}
				}
			}
		}
		stage("Deploy") {
			when {
                branch 'main'
            }
		    steps{
		        withCredentials([
					sshUserPrivateKey(credentialsId: 'aws-vm-key', keyFileVariable: 'KEYFILE'),
					string(credentialsId: 'ec2-ssh-user-and-dns', variable: 'TOKEN')
					]) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no -i $KEYFILE $TOKEN '
                        cd .server &&
                        sudo docker-compose stop backend &&
                        sudo docker container prune -f &&
                        sudo docker-compose up -d &&
                        sudo docker image prune -f
                        '
                    '''
				}
				emailext subject: "Pipeline Success \uD83C\uDF08 \u2728",
					to: "negoiupaulica21@gmail.com",
					attachLog: true,
					body: "Build Tag:\t${env.BUILD_TAG}\n\nMessage:\tYour Docker image with tag '${version}' has been deployed! \uD83D\uDE00"
		    }
		}
	}
	post {
		failure {
			emailext subject: "Pipeline Failed \u26A0\ufe0f \uD83D\uDD25",
					to: "negoiupaulica21@gmail.com",
					attachLog: true,
					body: "Build Tag:\t${env.BUILD_TAG}\n\nMessage:\tThe Jenkins pipeline has failed. \uD83D\uDE2D"
		}
	}
}
