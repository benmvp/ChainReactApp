import React from 'react'
import {
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  Text,
  Linking,
  Animated
} from 'react-native'
import PurpleGradient from '../Components/PurpleGradient'
import VenueMap from '../Components/VenueMap'
import Gallery from '../Components/Gallery'
import { Images, Metrics } from '../Themes'
import { connect } from 'react-redux'
import Secrets from 'react-native-config'
import styles from './Styles/LocationScreenStyle'

const VENUE_LATITUDE = 45.524166
const VENUE_LONGITUDE = -122.681645
const { UBER_CLIENT_ID } = Secrets

class LocationScreen extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      showRideOptions: false,
      scrollY: new Animated.Value(0)
    }
  }

  static navigationOptions = {
    tabBarLabel: 'Location',
    tabBarIcon: ({ focused }) => (
      <Image source={focused ? Images.activeLocationIcon : Images.inactiveLocationIcon} />
    )
  }

  openMaps (daddr = '128+NW+Eleventh+Ave+Portland,+OR+97209') {
    const googleMaps = `comgooglemaps://?daddr=${daddr}`
    const appleMaps = `http://maps.apple.com?daddr=${daddr}`

    Linking.canOpenURL(googleMaps).then((supported) => {
      if (supported) {
        Linking.openURL(googleMaps)
      } else {
        Linking.canOpenURL(appleMaps).then((supported) =>
          supported
          ? Linking.openURL(appleMaps)
          : window.alert('Unable to find maps application.')
        )
      }
    })
  }

  openLyft () {
    const lat = `destination[latitude]=${VENUE_LATITUDE}`
    const lng = `destination[longitude]=${VENUE_LONGITUDE}`
    const lyft = `lyft://ridetype?${lat}&${lng}`

    Linking.canOpenURL(lyft).then((supported) => {
      if (supported) {
        Linking.openURL(lyft)
      } else {
        window.alert('Unable to open Lyft.')
      }
    })
  }

  openUber () {
    const pickup = 'action=setPickup&pickup=my_location'
    const client = `client_id=${UBER_CLIENT_ID}`
    const lat = `dropoff[latitude]=${VENUE_LATITUDE}`
    const lng = `dropoff[longitude]=${VENUE_LONGITUDE}`
    const nick = `dropoff[nickname]=The%20Armory`
    const daddr = `dropoff[formatted_address]=128%20NW%20Eleventh%20Ave%2C%20Portland%2C%20OR%2097209`
    const uber = `uber://?${pickup}&${client}&${lat}&${lng}&${nick}&${daddr}`

    Linking.canOpenURL(uber).then((supported) => {
      if (supported) {
        Linking.openURL(uber)
      } else {
        window.alert('Unable to open Uber.')
      }
    })
  }

  toggleRides = () => {
    this.refs.scrolly.scrollTo({x: 0, y: 180, animated: true})
    this.setState({showRideOptions: !this.state.showRideOptions})
  }

  renderBackground = () => {
    const height = Metrics.locationBackgroundHeight
    const { scrollY } = this.state
    return (
      <Animated.Image
        style={[styles.venue, {position: 'absolute'}, {
          height: height,
          transform: [{
            translateY: scrollY.interpolate({
              inputRange: [-height, 0, height],
              outputRange: [height, 0, 0]
            })
          }, {
            scale: scrollY.interpolate({
              inputRange: [-height, 0, height],
              outputRange: [0.9, 1, 1.5]
            })
          }]
        }]}
        source={Images.theArmory} />
    )
  }

  renderHeader = () => {
    const height = 314
    const { scrollY } = this.state
    return (
      <Animated.View style={{
        position: 'relative',
        height: height,
        padding: 0,
        opacity: scrollY.interpolate({
          inputRange: [-height, 0, height * 0.4, height * 0.9],
          outputRange: [1, 1, 1, 0]
        }),
        transform: [{
          translateY: scrollY.interpolate({
            inputRange: [-height, 0, height * 0.45, height],
            outputRange: [0, 0, height * 0.45, height * 0.4]
          })
        }]
      }}>
        <View style={styles.headingContainer}>
          <Text style={styles.mainHeading}>The Armory</Text>
          <Text style={styles.address}>
            128 NW Eleventh Ave{'\n'}
            Portland, OR 97209
          </Text>
        </View>
      </Animated.View>
    )
  }

  render () {
    const { showRideOptions } = this.state
    const { nearbyData } = this.props
    const { event } = Animated

    return (
      <PurpleGradient style={[styles.linearGradient, {flex: 1}]}>
        <ScrollView
          ref='scrolly'
          onScroll={event([{nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
          scrollEventThrottle={32}>
          <View style={styles.container}>
            {this.renderBackground()}
            {this.renderHeader()}
            <VenueMap style={styles.map} />
            <View style={styles.mapActions}>
              <TouchableOpacity onPress={() => this.openMaps()}>
                <View style={styles.getDirections}>
                  <View style={styles.addressContainer}>
                    <Text style={styles.venueName}>
                      The Armory
                    </Text>
                    <Text style={styles.venueAddress}>
                      128 NW Eleventh Ave, Portland, OR, 97209
                    </Text>
                  </View>
                  <View style={styles.directionsIcon}>
                    <Image source={Images.directionsIcon} />
                    <Text style={styles.directionsLabel}>Directions</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.toggleRides()}>
                <View style={styles.getRide}>
                  <Text style={styles.getRideLabel}>
                    Taking an Uber or Lyft?
                  </Text>
                  <Image
                    style={[styles.getRideIcon, showRideOptions && styles.flip]}
                    source={Images.chevronIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.rideOptions, showRideOptions && {height: 170}]}>
              <TouchableOpacity onPress={() => this.openLyft()}>
                <Image style={styles.rideButton} source={Images.lyftButton} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.openUber()}>
                <Image style={styles.rideButton} source={Images.uberButton} />
              </TouchableOpacity>
            </View>
            <View style={styles.nearby}>
              <Text style={styles.mainHeading}>
                Nearby
              </Text>
            </View>
            <Gallery
              data={nearbyData}
              onItemPress={(daddr) => this.openMaps(daddr)}
            />
          </View>
        </ScrollView>
      </PurpleGradient>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    nearbyData: state.location.nearby
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationScreen)
