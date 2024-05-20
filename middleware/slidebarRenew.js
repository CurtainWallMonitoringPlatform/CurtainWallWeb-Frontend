export default defineNuxtMiddleware(async (context) => {
  const { $axios, redirect } = context;
  try {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      redirect("/login");
      return;
    }

    const response = await $axios.get("/api/account/custom/getPermissions", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    // 将权限数据转换为 JSON 字符串并保存到 localStorage
    localStorage.setItem("userPermissions", JSON.stringify(response.data.data));
  } catch (error) {
    console.error("Failed to fetch permissions", error);
    redirect("/error");
  }
  console.log("slidebarRenew Middleware");
});
