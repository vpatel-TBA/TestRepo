<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="TBA.BeastWebServer.ReadConfig" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <table width="40%">
                <tr>
                    <td colspan="2" style="text-align: center"><b>Server Setting </b></td>
                </tr>
                <tr>
                    <td>userName</td>
                    <td>
                        <asp:TextBox ID="userName" runat="server"></asp:TextBox></td>
                </tr>
                <tr>
                    <td>password</td>
                    <td>
                        <asp:TextBox ID="password" runat="server"></asp:TextBox></td>
                </tr>
                <tr>
                    <td>serverName</td>
                    <td>
                        <asp:TextBox ID="serverName" runat="server"></asp:TextBox></td>
                </tr>
                <tr>
                    <td>serverName2</td>
                    <td>
                        <asp:TextBox ID="serverName2" runat="server"></asp:TextBox></td>
                </tr>
                <tr>
                    <td>port</td>
                    <td>
                        <asp:TextBox ID="port" runat="server"></asp:TextBox></td>
                </tr>
                <tr>
                    <td>retryCount</td>
                    <td>
                        <asp:TextBox ID="retryCount" runat="server"></asp:TextBox></td>
                </tr>

                <tr>
                    <td colspan="2" style="text-align: center"><b>Redis Server Setting </b></td>
                </tr>
                <tr>
                    <td>redisserver</td>
                    <td>
                        <asp:TextBox ID="redisserver" runat="server"></asp:TextBox></td>
                </tr>
                <tr>
                    <td>redisexpiretime</td>
                    <td>
                        <asp:TextBox ID="redisexpiretime" runat="server"></asp:TextBox></td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <asp:Button ID="btnGetConfig" Width="174px" runat="server" Text="Get Config" OnClick="btnGetConfig_Click" />
                    </td>
                </tr>
            </table>
        </div>
    </form>
</body>
</html>
