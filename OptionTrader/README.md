
react-native -> ReactAndroid -> build.gradle下面加入

project.ext.vectoricons = [
    iconFontNames: [ 'MaterialIcons.ttf', 'EvilIcons.ttf' ] // Name of the font files you want to copy
]

apply from: "../../react-native-vector-icons/fonts.gradle"
