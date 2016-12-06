/**
 * @file
 * Audio Equalizer Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  PropertyPaneTextField,
  PropertyPaneSlider,
  IWebPartContext
} from '@microsoft/sp-webpart-base';

import * as strings from 'AudioEqualizerStrings';
import { IAudioEqualizerWebPartProps } from './IAudioEqualizerWebPartProps';

//Imports the property pane custom fields
import { PropertyFieldColorPicker } from 'sp-client-custom-fields/lib/PropertyFieldColorPicker';

//Loads JQuery, Reverseorder & equalizer JavaScript libs
require('jquery');
import * as $ from 'jquery';
require('reverseorder');
require('equalizer');

/**
 * @class
 * Audio Equalizer Web Part
 */
export default class AudioEqualizerWebPart extends BaseClientSideWebPart<IAudioEqualizerWebPartProps> {

  private guid: string;

  /**
   * @function
   * Web part contructor.
   */
  public constructor(context: IWebPartContext) {
    super(context);

    this.guid = this.getGuid();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);
  }

  /**
   * @function
   * Renders HTML code
   */
  public render(): void {

    //Defines the output HTML code width HTML5 audio player & CSS styles
    var html = `
    <div class="${this.guid} equalizer"></div>
    <audio controls loop id="${this.guid}">
        <source src="${this.properties.audio}" type='${this.properties.audioType}'>
    </audio>
    <style>
.equalizer
{
	position: relative;
	margin:0 auto;
	margin-top: 40px;
	float:left;
}
.equalizer_bar
{
	float: left;
}
.equalizer_bar_component
{
	float: left;
	width: 100%;
}
    </style>
    `;
    this.domElement.innerHTML = html;

    //Calls the Equalizer JavaScript plugin init method
    ($ as any)('#' + this.guid).equalizer({
        width: this.properties.width, // in pixels - default is 600 pixels
        height: this.properties.height, // in pixels - default is 150 pixels
        color: this.properties.color, // in hexadecimal - default is #800080
        color1: this.properties.color1, // in hexadecimal - default is #B837F2
        color2: this.properties.color2, // in hexadecimal - default is #009AD9
        bars: this.properties.bars, // no. of bars - default is 20
        barMargin: this.properties.barMargin, // margin between vertical bars - default is 1
        components: this.properties.components, // no. components in one bar - default is 8
        componentMargin: this.properties.componentMargin, // margin between horizontal components - default is 1
        frequency: this.properties.frequency, // rate of equalizer frequency - default is 9 (from 0 to 20)
        refreshTime: this.properties.refreshTime // refresh time of animation - default is 100
    });
  }

  /**
   * @function
   * Generates a GUID
   */
  private getGuid(): string {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  /**
   * @function
   * Generates a GUID part
   */
  private s4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
  }

  /**
   * @function
   * PropertyPanel settings definition
   */
  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: false,
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('audio', {
                  label: strings.audio
                }),
                PropertyPaneTextField('audioType', {
                  label: strings.audioType
                }),
                PropertyPaneSlider('width', {
                  label: strings.width,
                  min: 1,
                  max: 800,
                  step: 1
                }),
                PropertyPaneSlider('height', {
                  label: strings.height,
                  min: 1,
                  max: 800,
                  step: 1
                }),
                PropertyPaneSlider('bars', {
                  label: strings.bars,
                  min: 1,
                  max: 40,
                  step: 1
                }),
                PropertyPaneSlider('barMargin', {
                  label: strings.bars,
                  min: 1,
                  max: 10,
                  step: 0.5
                }),
                PropertyPaneSlider('components', {
                  label: strings.bars,
                  min: 1,
                  max: 20,
                  step: 1
                }),
                PropertyPaneSlider('componentMargin', {
                  label: strings.componentMargin,
                  min: 1,
                  max: 10,
                  step: 0.5
                }),
                PropertyPaneSlider('frequency', {
                  label: strings.frequency,
                  min: 0,
                  max: 20,
                  step: 1
                }),
                PropertyPaneSlider('refreshTime', {
                  label: strings.refreshTime,
                  min: 1,
                  max: 1000,
                  step: 10
                }),
                PropertyFieldColorPicker('color', {
                  label: strings.color,
                  initialColor: this.properties.color,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('color1', {
                  label: strings.color1,
                  initialColor: this.properties.color1,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                }),
                PropertyFieldColorPicker('color2', {
                  label: strings.color2,
                  initialColor: this.properties.color2,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
