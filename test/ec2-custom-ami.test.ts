#!/usr/bin/env node
import { expect as expectCDK, matchTemplate, haveResourceLike, MatchStyle, SynthUtils } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/core';
import { Ec2CustomAmiStack, customAmiWindows } from '../lib/ec2-custom-ami-stack';

function createTestStack(app: App): Stack {

  // in order to test code referring existing resources set the respective account-id
  // this test is an integration test for it evaluates remote resources
  return new Ec2CustomAmiStack(app, 'Ec2CustomAmiStack', {
    env: {
      region: 'eu-central-1',
      account: '677675788676'
    }
  })
}

describe('Synthesized template can be created', () => {
  it('should not be empty', () => {
    const app: App = new App();
    // WHEN
    const stack: Stack = createTestStack(app);
    // THEN
    expectCDK(stack).notTo(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
  });


  it('should contain a EC2 instance resource referencing the custom machine image', () => {
    const app: App = new App();
    // WHEN
    const stack: Stack = createTestStack(app);
    // THEN
    expectCDK(stack).to(haveResourceLike("AWS::EC2::Instance", {
      ImageId: customAmiWindows
    }));
  });


});

describe("CDK synthesis result", () => {

  it('should define 2 artifacts and 1 stack', () => {
    const app: App = new App();
    // WHEN
    const stack: Stack = createTestStack(app);
    const assembly = app.synth();

    // THEN
    expect(assembly.artifacts).toHaveLength(2);
    expect(assembly.stacks).toHaveLength(1);
  });

  it('should match the snapshot', () => {
    const app: App = new App();
    // WHEN
    const stack: Stack = createTestStack(app);
    // THEN
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});
