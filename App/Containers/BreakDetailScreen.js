import React from 'react'
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native'
import PurpleGradient from '../Components/PurpleGradient'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import { format, addMinutes } from 'date-fns'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import { Images } from '../Themes'
import styles from './Styles/BreakDetailScreenStyle'

class BreakDetail extends React.Component {

  static navigationOptions = {
    tabBarLabel: 'Schedule',
    tabBarIcon: ({ focused }) => (
      <Image source={focused ? Images.activeScheduleIcon : Images.inactiveScheduleIcon} />
    )
  }

  goBack = () => {
    this.props.navigation.dispatch(NavigationActions.back())
  }

  renderMainImage = () => {
    const { type, duration, eventStart } = this.props
    const mainImage = type === 'lunch' ? Images.lunch : Images.lunch
    const eventDuration = Number(duration)
    const prettyStartTime = format(eventStart, 'h:mm')
    const endTime = addMinutes(eventStart, eventDuration)
    const prettyEndTime = format(endTime, 'h:mm')
    const meridiem = format(endTime, 'A')

    return (
      <View style={styles.mainImageContainer}>
        <Image style={styles.mainImage} source={mainImage} />
        <View style={styles.mainHeadingContainer}>
          <Text style={styles.breakHeading}>
            {this.props.type.toUpperCase()} BREAK
          </Text>
          <Text style={styles.breakDuration}>
            <Text>{prettyStartTime} - {prettyEndTime}</Text><Text style={styles.meridiem}>{meridiem}</Text>
          </Text>
        </View>
      </View>
    )
  }

  renderOption = (option, index) => {
    return (
      <Text key={index} style={styles.description}>{`\u2022  ${option}`}</Text>
    )
  }

  renderOptions = (options) => {
    return (
      <View style={styles.descriptionContainer}>
        {options.map((option, index) => this.renderOption(option, index))}
      </View>
    )
  }

  render () {
    const { options, veganOptions } = this.props

    return (
      <PurpleGradient style={styles.linearGradient}>
        <ScrollView>
          <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={this.goBack}>
              <Image style={styles.backButtonIcon} source={Images.arrowIcon} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.cardShadow1} />
            <View style={styles.cardShadow2} />
            <View style={styles.card}>
              {this.renderMainImage()}
              <View style={styles.content}>
                <Text style={styles.heading}>
                  {this.props.type === 'lunch' ? 'Lunch' : 'Refreshment'} Options
                </Text>
                <View style={styles.descriptionContainer}>
                  {this.renderOptions(options)}
                </View>
                <Text style={styles.heading}>
                  Vegan Options
                </Text>
                <View style={styles.descriptionContainer}>
                  {this.renderOptions(veganOptions)}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </PurpleGradient>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    ...state.schedule.selectedEvent
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BreakDetail)
