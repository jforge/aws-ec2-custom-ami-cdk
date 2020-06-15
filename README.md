# Deploy an AWS EC2 instance using existing resources

Deploying an EC2 instance based on a custom AMI using CDK.

Uses a custom windows AMI and VPC for a specific account.

## Account specific stack

Due to the custom AMI reference, this code works on a specific AWS account.
Change the respective values to meet your environment.

The test actively validates the referenced resources, so they must exist.

To synthesize and deploy the stack that refers to existing resources,
you need proper credentials resp. an AWS profile matching the account id,
otherwise the access will be denied.

```
cdk snyth --profile <your-profile
```

```
cdk deploy --profile <your-profile
```

Deploying the stack takes around 3 minutes until cloudformation returns successfully.

The EC2 instance is then in initializing mode and takes another 3-5 minutes.

You need to create a proper key-pair to get the Administrator password for an RDP connection, if your custom AMI is a Windows image, or to get SSH access, if it's a Linux based image.

Set the respective keyName, when creating the image (e.g. "my_keypair", if you already have a my_keypair.pem file)


## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
