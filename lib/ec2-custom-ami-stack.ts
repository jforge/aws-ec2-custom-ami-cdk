import { App, Construct, Stack, StackProps, CfnOutput } from '@aws-cdk/core';
import {
  Vpc, Peer, Port, SecurityGroup, MachineImage,
  Instance, InstanceType, InstanceClass, InstanceSize
} from "@aws-cdk/aws-ec2";

// You may not have access to the custom AMI, choose something different in this case
export const customAmiWindows: string = 'ami-03b8ccac039488e94';

export class Ec2CustomAmiStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Example Use case:
    // Instead of creating a new VPC, a pre-defined VPC has to be used
    // that was created as a constraint for some dedicated QA environment.
    const vpc = Vpc.fromLookup(this, "QA Network", {
      vpcId: 'vpc-03e3cbf7aad43a723'
    });

    // inherit a pre-defined security group (inbound allow 48030, 1883, 3389)
    //SecurityGroup.fromSecurityGroupId(this, "QA Windows Security Group", "sg-0b1f7396d2f142f45" );

    // Open ports for connections from anywhere
    // WARNING: be aware of the impact on using such settings, better retrict access to a VPN or others
    const windowsSecurityGroupOpcUa = new SecurityGroup(this, 'SecurityGroup', {
      vpc,
      securityGroupName: "windows-opcua-security-group",
      description: 'Allow mqtt, rdp and opc/tcp access to ec2 instances from anywhere',
      allowAllOutbound: true,
    });
    windowsSecurityGroupOpcUa.addIngressRule(Peer.anyIpv4(), Port.tcp(3389), 'allow public rdp access')
    windowsSecurityGroupOpcUa.addIngressRule(Peer.anyIpv4(), Port.tcp(8883), 'allow public mqtt access')
    windowsSecurityGroupOpcUa.addIngressRule(Peer.anyIpv4(), Port.tcp(1883), 'allow public mqtt access')
    windowsSecurityGroupOpcUa.addIngressRule(Peer.anyIpv4(), Port.tcp(4840), 'allow public opc-ua access')
    windowsSecurityGroupOpcUa.addIngressRule(Peer.anyIpv4(), Port.tcp(48030), 'allow public opc-ua access')

    // Sample: for a regular AMAZON LINUX AMI the simplest object would be:
    // const awsAMI = new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 });

    // For custom images, instantiate a `GenericWindowsImage`
    // with a map giving the AMI to in for each region:
    const genericWindows = MachineImage.genericWindows({
      'eu-central-1': customAmiWindows,
    });

    // Create a windows EC2 instance
    const windowsEc2Instance = new Instance(this, 'Windows EC2 Instance', {
      vpc,
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM),
      machineImage: genericWindows,
      securityGroup: windowsSecurityGroupOpcUa,
      keyName: "my_keypair_name"
    });

    new CfnOutput(this, "EC2 instance", {
      value: windowsEc2Instance.instanceId
    });
  }

}
