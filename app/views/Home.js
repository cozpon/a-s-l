import React, { Component } from "react";
import { Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { Container, Left, Right, Header, Body, Title } from "native-base";

class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
  let navigation = this.props.navigation;
    return (
        <Container>
        <Header style={{backgroundColor: '#a9c3d2'}}>
          <Left>
            <Icon
              name='map-o'
              type='font-awesome'
              size={25}
              color={'#FF9F1C'}
              underlayColor={'white'}
              onPress={() => navigation.navigate("DrawerOpen")}
            />
            </Left>

            <Body>
              <Title> Great Tutorial </Title>
            </Body>

            <Right>
              <Text> very nice </Text>
            </Right>
        </Header>

          <Text style={styles.text}>
          Welcome Home!
          </Text>
        </Container>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 300,
  },
});

export default Home;