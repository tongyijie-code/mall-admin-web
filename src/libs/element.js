import Vue from 'vue'
//按需引入elementUI插件
import {
    Form,
    FormItem,
    Input,
    Button,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    breadcrumb,
    breadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Pagination,
    Switch,
    Tooltip,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    Alert,
    Tabs,
    TabPane,
    Steps,
    Step,
    CheckboxGroup,
    Checkbox,
    Upload,
    Timeline,
    TimelineItem,
    

} from "element-ui";

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(breadcrumb)
Vue.use(breadcrumbItem),
Vue.use(Card),
Vue.use(Row),
Vue.use(Col),
Vue.use(Table),
Vue.use(TableColumn),
Vue.use(Pagination),
Vue.use(Switch),
Vue.use(Tooltip),
Vue.use(Dialog),
Vue.use(Tag),
Vue.use(Tree),
Vue.use(Select),
Vue.use(Option),
Vue.use(Cascader),
Vue.use(Alert),
Vue.use(Tabs),
Vue.use(TabPane),
Vue.use(Steps),
Vue.use(Step),
Vue.use(CheckboxGroup),
Vue.use(Checkbox),
Vue.use(Upload),
Vue.use(Timeline),
Vue.use(TimelineItem),


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
